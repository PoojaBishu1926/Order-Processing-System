const Order = require('../models/order.model');
const Inventory = require('../models/inventory.model');
const redisClient = require('../config/redis');
const { sendToSQS } = require('../services/sqs.service');

// Create an Order
const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.id;

        let totalAmount = 0;
        for (const item of items) {
            const product = await Inventory.findOne({ productId: item.productId });
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${item.productId} is out of stock` });
            }
            totalAmount += product.price * item.quantity;
        }

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            status: 'Pending'
        });

        await newOrder.save();

        // Push order to AWS SQS for async processing
        await sendToSQS(newOrder);

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Order by ID (with Redis caching)
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check Redis Cache
        const cachedOrder = await redisClient.get(`order:${id}`);
        if (cachedOrder) {
            return res.json(JSON.parse(cachedOrder));
        }

        // Fetch from MongoDB if not found in cache
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Store order in Redis with expiration (10 minutes)
        await redisClient.setex(`order:${id}`, 600, JSON.stringify(order));

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { createOrder, getOrderById };

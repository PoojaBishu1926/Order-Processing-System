const Order = require('../models/order.model');
const Inventory = require('../models/inventory.model');
const { checkStockAvailability, updateStockAfterOrder } = require('../services/inventory.service');
const { sendToSQS } = require('../services/sqs.service');
const redisClient = require('../config/redis'); 
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.id;

        // Step 1: Validate stock before placing the order
        const stockCheck = await checkStockAvailability(items);
        if (!stockCheck.success) {
            return res.status(400).json({ message: stockCheck.message });
        }

        // Step 2: Calculate Total Amount
        let totalAmount = 0;
        for (const item of items) {
            const product = await Inventory.findOne({ productId: item.productId });
            totalAmount += product.price * item.quantity;
        }

        // Step 3: Create New Order (Pending Status)
        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            status: 'Pending'
        });

        await newOrder.save();

        // Step 4: Deduct Stock Immediately After Order Placement
        await updateStockAfterOrder(items);

        // Step 5: Push order to AWS SQS for processing
        await sendToSQS(newOrder);

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.log(`caught error in creating order ${error.message}`)
        res.status(500).json({ message: 'Server error', error });
    }
};


const getOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params?.id
        const redisKey = `order:${orderId}`;

        const cachedOrder = await redisClient.get(redisKey);
        if (cachedOrder) {
            console.log("Order fetched from Redis Cache");
            return res.status(200).json({ data : JSON.parse(cachedOrder), message : "order fetched" });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw new Error("Invalid order ID format");
        }

        const order = await Order.findById(new mongoose.Types.ObjectId(orderId));
        if (!order) {
            throw new Error("Order not found");
        }

        await redisClient.set(redisKey, 3600, JSON.stringify(order));
        console.log("Order fetched from DB and stored in Redis");

        return res.status(200).json({ data : order, message : "order fetched" });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        next(error);
    }
};

    

module.exports = { createOrder , getOrderDetails};

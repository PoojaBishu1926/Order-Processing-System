const Inventory = require('../models/inventory.model');

// Add New Product to Inventory
const addStock = async (req, res) => {
    try {
        const { productId, name, stock, price } = req.body;

        // Check if product already exists
        let product = await Inventory.findOne({ productId });
        if (product) {
            return res.status(400).json({ message: "Product already exists in inventory" });
        }

        product = new Inventory({ productId, name, stock, price });
        await product.save();

        res.status(201).json({ message: "Stock added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Stock Level
const updateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { stock, price } = req.body;

        const product = await Inventory.findOneAndUpdate(
            { productId },
            { $set: { stock, price } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Stock updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get All Inventory Items
const getStock = async (req, res) => {
    try {
        const stockItems = await Inventory.find();
        res.status(200).json(stockItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { addStock, updateStock, getStock };

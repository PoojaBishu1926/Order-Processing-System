const Inventory = require('../models/inventory.model');

// Check Stock Availability
const checkStockAvailability = async (items) => {
    for (const item of items) {
        const product = await Inventory.findOne({ productId: item.productId });

        if (!product) {
            return { success: false, message: `Product ${item.productId} not found` };
        }

        if (product.stock < item.quantity) {
            return { success: false, message: `Product ${product.name} is out of stock` };
        }
    }
    return { success: true };
};

// Deduct Stock After Order Processing
const updateStockAfterOrder = async (items) => {
    for (const item of items) {
        await Inventory.findOneAndUpdate(
            { productId: item.productId },
            { $inc: { stock: -item.quantity } },  // Reduce stock
            { new: true }
        );
    }
};

module.exports = { checkStockAvailability, updateStockAfterOrder };

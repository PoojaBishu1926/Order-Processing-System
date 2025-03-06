const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },  // Ensures stock is never negative
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);

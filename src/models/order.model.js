const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ name: String, quantity: Number, price: Number }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processed', 'Failed'], default: 'Pending' }
});

module.exports = mongoose.model('Order', orderSchema);

const express = require('express');
const { createOrder, getOrderById } = require('../controllers/order.controller');
const authMiddleware = require('../middelware/authMiddleware');
const router = express.Router();

// Create Order (Protected Route)
router.post('/', authMiddleware, createOrder);

// Get Order Details (Protected Route)
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;

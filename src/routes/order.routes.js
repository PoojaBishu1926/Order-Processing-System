const express = require('express');
const { createOrder, getOrderDetails } = require('../controllers/order.controller');
const authMiddleware = require('../middelware/authMiddleware');
const router = express.Router();

// Create Order (Protected Route)
router.post('/', authMiddleware, createOrder);

// Get Order Details (Protected Route)
router.get('/:id', authMiddleware, getOrderDetails);

module.exports = router;

const express = require('express');
const { addStock, updateStock, getStock } = require('../controllers/inventory.controller');
const authMiddleware = require('../middelware/authMiddleware'); // If authentication is required

const router = express.Router();

router.post('/add', authMiddleware, addStock); // Add new stock
router.put('/update/:productId', authMiddleware, updateStock); // Update stock
router.get('/list', getStock); // Get all stock items

module.exports = router;

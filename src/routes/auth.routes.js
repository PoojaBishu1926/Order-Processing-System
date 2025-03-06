const express = require('express');
const { register, login, refreshToken } = require('../controllers/auth.controller');
const router = express.Router();

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Token Refresh
router.post('/refresh', refreshToken);

module.exports = router;

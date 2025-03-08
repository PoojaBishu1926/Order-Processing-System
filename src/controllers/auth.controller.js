const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '50m'  // Access token valid for 15 minutes
    });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
        expiresIn: '7d'  // Refresh token valid for 7 days
    });
};

// Register a New User
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Refresh JWT Token
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });

            const newAccessToken = generateToken({ _id: decoded.id, email: decoded.email });
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { register, login, refreshToken };

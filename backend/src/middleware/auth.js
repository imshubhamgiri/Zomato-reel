const FoodPartner = require('../models/foodPartner.model');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const FoodPartnerAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Please Login first' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await FoodPartner.findById(decoded.Id);
        if (!foodPartner) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.log('Authenticated user:', foodPartner.id);
        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

async function userAuthMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Please login first' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.Id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed :' + error.message });
    }
}

async function loginMiddleware(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Please Login First' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.Id) || await FoodPartner.findById(decoded.Id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        // Fixed: use 'restrauntName' (with typo from model) instead of 'restaurantName'
        return res.status(200).json({
            message: "User found",
            name: user.name || user.restrauntName,  // Changed from restaurantName
            email: user.email,
            restaurantName: user.restrauntName,      // Changed from restaurantName
            userType: user.restrauntName ? 'partner' : 'user'  // Changed from restaurantName
        });
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed: ' + error.message });
    }
}

module.exports = { FoodauthMiddleware: FoodPartnerAuthMiddleware, userAuthMiddleware, loginMiddleware };
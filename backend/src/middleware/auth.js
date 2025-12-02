const FoodPartner = require('../models/foodPartner.model');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const FoodPartnerAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                 message: 'Please Login first' 
                });
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

async function userAuthMiddleware(req,res,next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Please login first' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.Id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token', id: decoded.Id });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed :' + error.message });
    }
}

module.exports = { FoodauthMiddleware: FoodPartnerAuthMiddleware, userAuthMiddleware };
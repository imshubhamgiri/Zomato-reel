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
            return res.status(401).json({ message: ' partner Invalid token' });
        }
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
            return res.status(401).json({ message: 'User Invalid token' });
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
        
        const userType = user.restaurantName ? 'partner' : 'user';
        const responseData = {
            message: "User found",
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            userType: userType
        };
        
        if (userType === 'partner') {
            responseData.restaurantName = user.restaurantName;
            responseData.phone = user.phone;
            responseData.address = user.address;
        }
        
        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed: ' + error.message });
    }
}

async function combineAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Please Login first' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //FoodPartner check
        const foodPartner = await FoodPartner.findById(decoded.Id);
        if (foodPartner) {
            req.foodPartner = foodPartner;
            return next();
        }
        
        // If not a partner, check for User
        const user = await User.findById(decoded.Id);
        if (user) {
            req.user = user;
            return next();
        }
        
        return res.status(401).json({ message: 'Invalid token' });
        
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
}

module.exports = { FoodauthMiddleware: FoodPartnerAuthMiddleware, userAuthMiddleware, loginMiddleware, combineAuth };
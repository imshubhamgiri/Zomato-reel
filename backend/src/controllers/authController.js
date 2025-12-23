const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const FoodPartner = require('../models/foodPartner.model');
const authController = {};

authController.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ Id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 86400000 }); // 1 day
        res.status(201).json({ 
            user: { id: newUser._id.toString(), name: newUser.name, email: newUser.email },
            message: 'User registered successfully' 
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).lean();     
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ Id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 86400000 }); // 1 day
        res.status(200).json({ 
            user: { id: user._id, name: user.name, email: user.email },
            message: 'Login successful'
         });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

authController.logoutuser = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: 'Logout successful' });
}

authController.registerFodPartner = async (req, res) => {
    // Implementation for food partner registration
    const { name, email, password , restaurantName, phone , address } = req.body;
    try {
        
        const existing = await FoodPartner.findOne({email}).lean()
        if(existing){
             return res.status(400).json({ message: 'Email already exists', field: 'email' });
        }
         
         const hashedPassword = await bcrypt.hash(password , 10);
       const newUser = new FoodPartner({ name, email, restaurantName, phone,address, password: hashedPassword });
         await newUser.save();
        const token = jwt.sign(
            {Id:newUser._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )
        res.cookie('token',token)
       return res.status(201).json({
        message:"Registration successful",
        user:{id:newUser._id.toString(),name: newUser.name,phone: newUser.phone,restaurantName:newUser.restaurantName, address: newUser.address, email: newUser.email, }})
    } catch (error) {
        console.log('Registration error', error)
        res.status(500).json({message:"server error",error})
    }

}

authController.loginFodPartner = async (req, res) => {
    // Implementation for food partner registration
    const { email, password } = req.body;
    // Similar logic as user registration can be applied here
    try {
        
        const existing = await FoodPartner.findOne({email}).lean()
        if(!existing){
           return res.status(400).json({message:"invalid credential"})
        } 
       const isMatch = await bcrypt.compare(password, existing.password);
       if(!isMatch){
          return res.status(400).json({message:"invalid credential"})

       }
        const token = jwt.sign(
            {Id:existing._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )
        res.cookie('token',token)
       return res.status(200).json({
        message:"login successful",
        user:{id:existing._id.toString(), name: existing.name,restaurantName: existing.restaurantName,phone: existing.phone, address: existing.address, email: existing.email, }})
    } catch (error) {
        res.status(500).json({message:"server error",error})
    }

}

authController.logoutFoodpartner = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: 'FoodPartner Logged out successfully' });
}


module.exports = authController;
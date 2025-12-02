const food = require('../models/food.model');
const FoodPartner = require('../models/foodPartner.model');
const storageService = require('../service/storage.service')
const foodController = {};
const {v4:uuid} = require('uuid')

foodController.addFoodItem = async (req, res) => {
    try {
        if(!req.foodPartner || !req.foodPartner.id || !req.file){
            return res.status(401).json({ message: 'Unauthorized: No food partner info' });
        }
        const { name, description, price } = req.body;

        // Upload image using the uploadImage function
        const imageUploadResponse = await storageService.uploadVideo(
            req.file.buffer, 
            uuid(), 
            req.file.mimetype
        );

        const foodPartnerId = req.foodPartner.id;
        const newFoodItem = new food({
            name,
            video: imageUploadResponse.url,  // Store the ImageKit URL to db
            description,
            price,
            foodPartner: foodPartnerId
        });
        await newFoodItem.save();
        
        res.status(201).json({ 
            message: 'Food item added successfully',
            foodItem: newFoodItem
        });
    } catch (error) {
        console.error('Add food item error:', error);
        res.status(500).json({ message: 'Failed to add food item', error: error.message });
    }
};

foodController.getFoodItems = async (req, res) => {
    try {
        const foodItems = await food.find().populate('foodPartner', 'name');
        res.status(200).json({ message: 'Food items retrieved successfully', fooditems: foodItems });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve food items', error });
    }
};

module.exports = foodController;
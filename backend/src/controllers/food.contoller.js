const food = require('../models/food.model');
const FoodPartner = require('../models/foodPartner.model');
const likedFood = require('../models/like.model');
const savedFood = require('../models/save.model');
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
        const foodItems = await food.find().populate('foodPartner', 'name').lean();
        const userId = req.user ? req.user.id : null;

    if (!userId) {
        // If no user is logged in, return food items without like/save status
        return res.status(200).json({ message: 'Food items retrieved successfully', fooditems: foodItems });
    }
   
     const foodItemIds = foodItems.map(item => item._id);

    const userLikes = await likedFood.find({
        userId: userId,  
        food: { $in: foodItemIds }
    }).select('food').lean();

    const userSaves = await savedFood.find({
        userId: userId, 
        food: { $in: foodItemIds }
    }).select('food').lean();
    
    const likedFoodIds = new Set(userLikes.map(like => like.food.toString()));
    const savedFoodIds = new Set(userSaves.map(save => save.food.toString()));

    const foodItemsWithStatus = foodItems.map(item => {
        const itemIdString = item._id.toString();
        
        return {
            ...item,
            isLiked: likedFoodIds.has(itemIdString),
            isSaved: savedFoodIds.has(itemIdString)
        };
    });

    res.status(200).json({ message: 'Food items retrieved successfully', fooditems: foodItemsWithStatus });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve food items', error });
    }
};

foodController.GetfoodById = async (req ,res)=>{
    if(!req.params.id){
        console.log("Partner Id is required");
        return res.status(400).json({message:"Partner Id is required"})
    }
         const id = req.params.id
    try {
        const response = await food.find({foodPartner:id})
     return res.status(200).json({
            message:"food retrieved successfully",
            fooditems:response
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to retrieve food items', error });
    }
}

module.exports = foodController;
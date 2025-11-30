const food = require('../models/food.model');
const FoodPartner = require('../models/foodPartner.model');

const foodController = {};

foodController.addFoodItem = async (req, res) => {
    try {
        if(!req.foodPartner || !req.foodPartner.id || !req.file){
            return res.status(401).json({ message: 'Unauthorized: No food partner info' });
        }
        const { name, video, description, price } = req.body;

        const foodPartnerId = req.foodPartner.id; // Retrieved from auth middleware
         // Retrieved from auth middleware
        // const newFoodItem = new food({
        //     name,
        //     video,
        //     description,
        //     price,
        //     foodPartner: foodPartnerId // Assuming 'id' is the food partner ID passed in the request body
        // });
        // await newFoodItem.save();
        // res.status(201).json(newFoodItem, { message: 'Food item added successfully' });
        res.status(201).json({ message: 'Food item added successfully', file: req.file ,data: req.body});
    } catch (error) {
        res.status(500).json({ message: 'Failed to add food item', error });
    }
};

foodController.listfoodItems = async (req, res) => {
    try {
        const foodItems = await food.find().populate('foodPartner', 'name');
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve food items', error });
    }
};

module.exports = foodController;
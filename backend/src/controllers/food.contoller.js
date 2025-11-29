const food = require('../models/food.model');
const FoodPartner = require('../models/foodPartner.model');

const foodController = {};

foodController.addFoodItem = async (req, res) => {
    try {
        if(!req.foodPartner || !req.foodPartner.id){
            return res.status(401).json({ message: 'Unauthorized: No food partner info' });
        }
        const { name, video, description, price } = req.body;

        const foodPartnerId = req.foodPartner.id; // Retrieved from auth middleware
        const newFoodItem = new food({
            name,
            video,
            description,
            price,
            foodPartner: foodPartnerId
        });
        await newFoodItem.save();
        res.status(201).json(newFoodItem, { message: 'Food item added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add food item', error });
    }
};

module.exports = foodController;
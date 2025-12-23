const express = require('express');
const foodroutes = express.Router();
const foodController = require('../controllers/food.controller');
const { FoodauthMiddleware, combineAuth } = require('../middleware/auth.js');
const multer = require('multer');
const storage = multer.memoryStorage(); // IMPORTANT!
const upload = multer({ storage: storage });

// food-related routes here
foodroutes.post('/add', FoodauthMiddleware, upload.single('video'), foodController.addFoodItem);
foodroutes.delete('/delete',FoodauthMiddleware, foodController.deleteFoodItem);
// foodroutes.post('/trialadd',  foodController.addFoodItem); // Uncomment for testing purposes
foodroutes.get('/listfood', combineAuth , foodController.getFoodItems);
foodroutes.get('/getfood/:id', foodController.GetfoodById);
foodroutes.put('/update', FoodauthMiddleware, foodController.updateFoodItem);

module.exports = foodroutes;
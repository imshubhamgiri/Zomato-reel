const express = require('express');
const foodroutes = express.Router();
const foodController = require('../controllers/food.contoller');
const { FoodauthMiddleware, userAuthMiddleware } = require('../middleware/auth.js');
const multer = require('multer');
const storage = multer.memoryStorage(); // IMPORTANT!
const upload = multer({ storage: storage });

// food-related routes here
foodroutes.post('/add', FoodauthMiddleware, upload.single('video'), foodController.addFoodItem);
// foodroutes.post('/trialadd',  foodController.addFoodItem); // Uncomment for testing purposes
foodroutes.get('/list',userAuthMiddleware, foodController.getFoodItems);
foodroutes.get('/listfood', foodController.getFoodItems);

module.exports = foodroutes;
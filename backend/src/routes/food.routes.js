const express = require('express');
const foodroutes = express.Router();
const foodController = require('../controllers/food.contoller');
const { FoodauthMiddleware } = require('../middleware/auth.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// food-related routes here
foodroutes.post('/add', FoodauthMiddleware, upload.single('video'), foodController.addFoodItem);
// foodroutes.post('/trialadd',  foodController.addFoodItem); // Uncomment for testing purposes
// foodroutes.get('/list', foodController.listFoodItems);

module.exports = foodroutes;
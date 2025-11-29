const express = require('express');
const foodroutes = express.Router();
const foodController = require('../controllers/food.contoller');
const { FoodauthMiddleware } = require('../middleware/auth.js');

// food-related routes here
foodroutes.post('/add', FoodauthMiddleware, foodController.addFoodItem);
// foodroutes.get('/list', foodController.listFoodItems);

module.exports = foodroutes;
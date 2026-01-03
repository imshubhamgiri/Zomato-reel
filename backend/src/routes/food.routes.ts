import express, { Router } from 'express';
import * as foodController from '../controllers/food.controller';
import { FoodPartnerAuthMiddleware, combineAuth } from '../middleware/auth';
import multer from 'multer';

const foodroutes: Router = express.Router();
const storage = multer.memoryStorage(); // IMPORTANT!
const upload = multer({ storage: storage });

// food-related routes here
foodroutes.post('/add', FoodPartnerAuthMiddleware, upload.single('video'), foodController.addFoodItem);
foodroutes.delete('/delete', FoodPartnerAuthMiddleware, foodController.deleteFoodItem);
// foodroutes.post('/trialadd',  foodController.addFoodItem); // Uncomment for testing purposes
foodroutes.get('/listfood', combineAuth, foodController.getFoodItems);
foodroutes.get('/getfood/:id', foodController.GetfoodById);
foodroutes.put('/update', FoodPartnerAuthMiddleware, foodController.updateFoodItem);

export default foodroutes;
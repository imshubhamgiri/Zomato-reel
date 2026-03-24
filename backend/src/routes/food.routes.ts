import express, { Router } from 'express';
import * as foodController from '../controllers/food.controller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateAddFoodRequest, validateUpdateFoodRequest } from '../middleware/validation';
import multer from 'multer';

const foodroutes: Router = express.Router();
const storage = multer.memoryStorage(); // IMPORTANT!
const upload = multer({ storage: storage });
const requirePartner = [requireAuth, requireRole(['partner'])];

// Backward-compatible aliases (specific routes FIRST to avoid conflicts)
foodroutes.post('/add', requirePartner, upload.single('video'), validateAddFoodRequest, foodController.addFoodItem);
foodroutes.get('/listfood', requireAuth, foodController.getFoodItems);
foodroutes.get('/getfood/:id', foodController.GetfoodById);
foodroutes.put('/update', requirePartner, validateUpdateFoodRequest, foodController.updateFoodItem);
foodroutes.delete('/delete', requirePartner, foodController.deleteFoodItem);

// Refined routes (generic routes LAST)
foodroutes.post('/', requirePartner, upload.single('video'), validateAddFoodRequest, foodController.addFoodItem);
foodroutes.get('/', requireAuth, foodController.getFoodItems);
foodroutes.get('/partners/:id', foodController.GetfoodById);
foodroutes.patch('/:foodId', requirePartner, (req, _res, next) => {
	req.body.foodId = req.params.foodId;
	next();
}, validateUpdateFoodRequest, foodController.updateFoodItem);
foodroutes.delete('/:foodId', requirePartner, (req, _res, next) => {
	req.body.foodId = req.params.foodId;
	next();
}, foodController.deleteFoodItem);

export default foodroutes;
import express from 'express';
import { userAuthMiddleware } from  '../middleware/auth';
import * as ActionController from '../controllers/actionController';
import { actionLimiter } from '../middleware/rateLimiter';
import { validateFoodActionBody } from '../middleware/validation';

const router = express.Router();

router.post('/like', actionLimiter, userAuthMiddleware, validateFoodActionBody, ActionController.likefood);
router.post('/save', actionLimiter, userAuthMiddleware, validateFoodActionBody, ActionController.saveFood);

export default router;
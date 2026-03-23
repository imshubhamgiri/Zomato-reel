import express from 'express';
import { requireAuth } from  '../middleware/auth';
import * as ActionController from '../controllers/actionController';
import { actionLimiter } from '../middleware/rateLimiter';
import { validateFoodActionBody } from '../middleware/validation';

const router = express.Router();

router.post('/like', actionLimiter, requireAuth, validateFoodActionBody, ActionController.likefood);
router.post('/save', actionLimiter, requireAuth, validateFoodActionBody, ActionController.saveFood);

export default router;
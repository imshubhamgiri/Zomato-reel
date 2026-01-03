import express from 'express';
import { combineAuth } from  '../middleware/auth';
import * as ActionController from '../controllers/actionController';

const router = express.Router();

router.post('/like', combineAuth, ActionController.likefood);
router.post('/save', combineAuth, ActionController.saveFood);

export default router;
import express, { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { requireAuth, requireRole } from '../middleware/auth';
const router: Router = express.Router();

router.get('/foodPartners', requireAuth, requireRole(['partner']), profileController.getFoodPartnerProfile);
router.get('/foodPartners/:id', profileController.getPublicFoodPartnerProfile);
export default router;
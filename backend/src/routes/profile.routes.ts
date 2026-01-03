import express, { Router } from 'express';
import * as profileController from '../controllers/profileController';
const router: Router = express.Router();

router.get('/foodpartner/:id', profileController.getFoodPartnerProfile);
export default router;
import { Router } from "express";
import { getUserProfile, updateUserProfile, addUserAddress, getUserAddresses, deleteUserAddress, updateUserAddress, setDefaultAddress } from "../controllers/userProfileController";
import { requireAuth } from '../middleware/auth';
const router = Router();

// User profile routes
router.get('/me', requireAuth, getUserProfile);
router.patch('/me', requireAuth, updateUserProfile);
router.get('/me/addresses', requireAuth, getUserAddresses);
router.post('/me/addresses', requireAuth, addUserAddress);
router.patch('/me/addresses/:addressId', requireAuth, updateUserAddress);
router.patch('/me/addresses/:addressId/default', requireAuth, setDefaultAddress);
router.delete('/me/addresses/:addressId', requireAuth, deleteUserAddress);

export default router;
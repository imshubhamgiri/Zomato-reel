import { Router } from "express";
import { getUserProfile, updateUserProfile, addUserAddress, getUserAddresses, deleteUserAddress, updateUserAddress, setDefaultAddress } from "../controllers/userProfileController";
import { userAuthMiddleware } from '../middleware/auth';
import { validateAddAddressRequest, validateUpdateAddressRequest } from '../middleware/validation';
const router = Router();

// User profile routes
router.get('/me', userAuthMiddleware, getUserProfile);
router.patch('/me', userAuthMiddleware, updateUserProfile);
router.get('/me/addresses', userAuthMiddleware, getUserAddresses);
router.post('/me/addresses', userAuthMiddleware, validateAddAddressRequest, addUserAddress);
router.patch('/me/addresses/:addressId', userAuthMiddleware, validateUpdateAddressRequest, updateUserAddress);
router.patch('/me/addresses/:addressId/default', userAuthMiddleware, setDefaultAddress);
router.delete('/me/addresses/:addressId', userAuthMiddleware, deleteUserAddress);

export default router;
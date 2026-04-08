import { Router } from "express";;
import { getUserProfile } from "../controllers/userProfileController";
import { requireAuth } from '../middleware/auth';
import { updateUserProfile } from "../controllers/userProfileController";
const router = Router();

// Placeholder route for user profiles
router.get('/me',requireAuth, getUserProfile);
router.patch('/me',requireAuth, updateUserProfile);

export default router;
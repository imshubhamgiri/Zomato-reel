import express from 'express';
import * as authController from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import {
	validatePartnerLogin,
	validatePartnerRegister,
	// validateRefreshTokenRequest,
	validateUserLogin,
	validateUserRegister,
} from '../middleware/validation';

const authRoutes = express.Router();

//] authentication routes here
// User Routes
authRoutes.post('/users/login', authLimiter, validateUserLogin, authController.login)
authRoutes.post('/users/register', authLimiter, validateUserRegister, authController.register)
authRoutes.post('/users/logout', requireAuth, authController.logoutuser)
authRoutes.get('/users/logout', requireAuth, authController.logoutuser)
// Food Partner Routes
authRoutes.post('/partners/register', authLimiter, validatePartnerRegister, authController.registerFoodPartner)
authRoutes.post('/partners/login', authLimiter, validatePartnerLogin, authController.loginFoodPartner)
authRoutes.post('/partners/logout', requireAuth, authController.logoutFoodpartner)
authRoutes.get('/partners/logout', requireAuth, authController.logoutFoodpartner)

authRoutes.post('/refresh', authLimiter, authController.refreshToken)
authRoutes.get('/me', requireAuth, authController.getMe)

export default authRoutes;
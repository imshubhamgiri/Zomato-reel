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
authRoutes.post('/user/login', authLimiter, validateUserLogin, authController.login)
authRoutes.post('/user/register', authLimiter, validateUserRegister, authController.register)
authRoutes.post('/user/logout', requireAuth, authController.logoutuser)
authRoutes.get('/user/logout', requireAuth, authController.logoutuser)
// Food Partner Routes
authRoutes.post('/partner/register', authLimiter, validatePartnerRegister, authController.registerFoodPartner)
authRoutes.post('/partner/login', authLimiter, validatePartnerLogin, authController.loginFoodPartner)
authRoutes.post('/partner/logout', requireAuth, authController.logoutFoodpartner)
authRoutes.get('/partner/logout', requireAuth, authController.logoutFoodpartner)

authRoutes.post('/refresh', authLimiter, authController.refreshToken)
authRoutes.get('/loginCheck', requireAuth, authController.loginCheck)

export default authRoutes;
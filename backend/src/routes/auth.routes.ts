import express from 'express';
import * as authController from '../controllers/authController';
import { loginMiddleware } from '../middleware/auth';
import { validateUserRegister } from '../middleware/validation';

const authRoutes = express.Router();

//] authentication routes here
// User Routes
authRoutes.post('/user/login',authController.login)
authRoutes.post('/user/register', validateUserRegister, authController.register)
authRoutes.get('/user/logout',authController.logoutuser)
// Food Partner Routes
authRoutes.post('/partner/register',authController.registerFoodPartner)
authRoutes.post('/partner/login',authController.loginFoodPartner)
authRoutes.get('/partner/logout',authController.logoutFoodpartner)
authRoutes.get('/loginCheck',loginMiddleware)

export default authRoutes;
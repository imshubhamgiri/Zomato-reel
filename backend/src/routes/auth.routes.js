const express = require('express');
const authController = require('../controllers/authController');
const authRoutes = express.Router();

//] authentication routes here
// User Routes
authRoutes.post('/user/login',authController.login)
authRoutes.post('/user/register',authController.register)
authRoutes.get('/user/logout',authController.logoutuser)
// Food Partner Routes
authRoutes.post('/partner/register',authController.registerFodPartner)
authRoutes.post('/partner/login',authController.loginFodPartner)
authRoutes.get('/partner/logout',authController.logoutFoodpartner)

module.exports = authRoutes;
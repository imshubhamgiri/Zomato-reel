const express = require('express');
const authController = require('../controllers/authController');
const authRoutes = express.Router();

// Define your authentication routes here
authRoutes.post('/user/login',authController.login)
authRoutes.post('/user/register',authController.register)

module.exports = authRoutes;
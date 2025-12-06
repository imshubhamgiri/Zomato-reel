const express = require('express');
const router = express.Router();
const ActionController = require('../controllers/actionController');
const {userAuthMiddleware,FoodauthMiddleware} = require('../middleware/auth');

router.post('/like', userAuthMiddleware || FoodauthMiddleware, ActionController.likefood);
router.post('/save', userAuthMiddleware || FoodauthMiddleware, ActionController.saveFood);

module.exports = router;
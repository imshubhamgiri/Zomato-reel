const express = require('express');
const profileContoller = require('../controllers/profileContoller');
const { loginMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/foodpartner/:id', profileContoller.getFoodPartnerProfile);

module.exports = router;
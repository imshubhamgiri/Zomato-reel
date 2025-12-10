const express = require('express');
const profileContoller = require('../controllers/profileContoller');
const router = express.Router();

router.get('/foodpartner/:id', profileContoller.getFoodPartnerProfile);

module.exports = router;
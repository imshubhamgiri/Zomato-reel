const express = require('express');
const router = express.Router();
const ActionController = require('../controllers/actionController');
const {combineAuth} = require('../middleware/auth');

router.post('/like', combineAuth, ActionController.likefood);
router.post('/save', combineAuth, ActionController.saveFood);

module.exports = router;
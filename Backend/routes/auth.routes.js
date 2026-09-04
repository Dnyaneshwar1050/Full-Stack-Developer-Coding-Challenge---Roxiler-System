const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/change-password', verifyToken, authController.updatePassword);

module.exports = router;

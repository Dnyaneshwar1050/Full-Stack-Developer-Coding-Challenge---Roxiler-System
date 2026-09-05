const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  signupRules,
  loginRules,
  changePasswordRules,
} = require('../middleware/validationRules');

router.post('/signup', signupRules, validate, authController.register);
router.post('/register', signupRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', authController.logout || ((req, res) => res.json({ message: 'Logged out successfully' })));
router.post('/change-password', verifyToken, changePasswordRules, validate, authController.updatePassword);
router.put('/password', verifyToken, changePasswordRules, validate, authController.updatePassword);
router.post('/password', verifyToken, changePasswordRules, validate, authController.updatePassword);

module.exports = router;

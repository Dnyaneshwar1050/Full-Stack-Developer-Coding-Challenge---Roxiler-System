const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  signupRules,
  createStoreRules,
} = require('../middleware/validationRules');

// Protect all admin routes with JWT and ADMIN role
router.use(verifyToken);
router.use(requireRole('ADMIN'));

router.get('/stats', adminController.dashboard);
router.get('/users', adminController.listUsers);
router.get('/stores', adminController.listStores);
router.post('/add-user', signupRules, validate, adminController.createUser);
router.post('/add-store', createStoreRules, validate, adminController.createStore);
router.get('/users/:id', adminController.getUserDetails);

module.exports = router;

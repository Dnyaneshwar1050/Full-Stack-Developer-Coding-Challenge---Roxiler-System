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
router.get('/dashboard', adminController.dashboard);

router.get('/users', adminController.listUsers);
router.post('/add-user', signupRules, validate, adminController.createUser);
router.post('/users', signupRules, validate, adminController.createUser);
router.get('/users/:id', adminController.getUserDetails);
router.delete('/users/:id', adminController.deleteUser);

router.get('/stores', adminController.listStores);
router.post('/add-store', createStoreRules, validate, adminController.createStore);
router.post('/stores', createStoreRules, validate, adminController.createStore);
router.delete('/stores/:id', adminController.deleteStore);

module.exports = router;

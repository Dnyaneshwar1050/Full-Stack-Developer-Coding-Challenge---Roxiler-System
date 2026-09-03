const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.use(requireRole('admin'));

router.post('/users', admin.createUser);
router.post('/stores', admin.createStore);
router.get('/dashboard', admin.dashboard);
router.get('/users', admin.listUsers);
router.get('/stores', admin.listStores);
router.get('/users/:id', admin.getUserDetails);

module.exports = router;

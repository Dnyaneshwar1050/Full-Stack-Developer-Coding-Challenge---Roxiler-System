const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/stats', admin.dashboard);
router.get('/users', admin.listUsers);
router.get('/stores', admin.listStores);
router.post('/add-user', admin.createUser);
router.post('/add-store', admin.createStore);
router.get('/users/:id', admin.getUserDetails);

module.exports = router;

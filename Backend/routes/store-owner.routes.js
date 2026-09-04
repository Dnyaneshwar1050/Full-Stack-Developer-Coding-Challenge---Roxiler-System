const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/dashboard', verifyToken, requireRole('store_owner'), storeController.ownerDashboard);

module.exports = router;

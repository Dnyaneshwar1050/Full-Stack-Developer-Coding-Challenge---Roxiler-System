const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const ratingController = require('../controllers/rating.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', storeController.listStoresPublic);
router.get('/:id', storeController.getStoreDetails);

// rating endpoints
router.post('/:id/rate', verifyToken, ratingController.submitOrUpdate);

// Owner dashboard
router.get('/owner/dashboard', verifyToken, requireRole('store_owner'), storeController.ownerDashboard);

module.exports = router;

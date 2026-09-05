const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  rateStoreBodyRules,
  updateRateStoreRules,
} = require('../middleware/validationRules');

router.use(verifyToken);

router.post('/submit', rateStoreBodyRules, validate, storeController.submitOrUpdateRating);
router.put('/:storeId/update', updateRateStoreRules, validate, storeController.submitOrUpdateRating);

module.exports = router;

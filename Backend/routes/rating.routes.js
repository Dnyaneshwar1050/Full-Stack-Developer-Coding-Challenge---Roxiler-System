const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/submit', verifyToken, ratingController.submitOrUpdate);
router.put('/:storeId/update', verifyToken, ratingController.submitOrUpdate);

module.exports = router;

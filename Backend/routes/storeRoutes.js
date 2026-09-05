const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const storeController = require('../controllers/storeController');

// Optional authentication middleware to attach user if token present
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Allow unauthenticated access if token is absent/invalid on public routes
    }
  }
  next();
};

router.get('/list', optionalAuth, storeController.listStores);
router.get('/:id', storeController.getStoreDetails);

module.exports = router;

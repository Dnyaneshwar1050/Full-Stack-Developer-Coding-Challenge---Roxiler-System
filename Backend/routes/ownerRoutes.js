const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(requireRole('STORE_OWNER'));

router.get('/dashboard', ownerController.getDashboard);

module.exports = router;

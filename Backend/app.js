const express = require('express');
const cors = require('cors');

// Ensure models and associations are loaded
require('./models');

// Route imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Store Rating API is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/store-owner', ownerRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/rating', ratingRoutes);

// 404 fallback handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;

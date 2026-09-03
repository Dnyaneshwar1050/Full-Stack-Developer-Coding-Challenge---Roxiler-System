require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// ensure models are loaded (associations)
require('./models');


// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const storeRoutes = require('./routes/store.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => res.json({ status: 'ok' }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);

// Error handling middleware
app.use((req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Start the server
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
	app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
	console.error('Failed to start server', err);
});

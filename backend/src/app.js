const express = require('express');
const cors = require('cors');
require('dotenv').config();


const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

// Middleware: parse incoming JSON request bodies automatically
app.use(express.json());

// Middleware: allow our frontend (different origin/port) to call this API.
// We'll tighten this to a specific frontend URL in Phase 33 (backend deployment).
app.use(cors());

// Routes
// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;
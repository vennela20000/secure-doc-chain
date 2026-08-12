const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { createUser, listUsers } = require('../controllers/adminController');

// Both routes require: valid token AND admin role
router.post('/users', requireAuth, requireRole('admin'), createUser);
router.get('/users', requireAuth, requireRole('admin'), listUsers);

module.exports = router;
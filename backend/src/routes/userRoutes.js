const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { getCurrentUser } = require('../controllers/userController');

router.get('/me', requireAuth, getCurrentUser);

module.exports = router;
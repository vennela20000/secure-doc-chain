const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const {
  uploadDocument,
  listDocuments,
  downloadDocument
} = require('../controllers/documentController');

router.post(
  '/',
  requireAuth,
  requireRole('admin', 'engineer'),
  upload.single('file'),
  uploadDocument
);

router.get('/', requireAuth, listDocuments);
router.get('/:id/download', requireAuth, downloadDocument);

module.exports = router;
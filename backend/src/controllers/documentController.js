const fs = require('fs');
const pool = require('../config/database');

async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const { filename, path: filePath, mimetype, size } = req.file;
   const uploadedBy = req.user.userId; // was req.user.id

    const result = await pool.query(
      `INSERT INTO documents (title, description, file_name, file_path, file_size, mime_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, file_name, file_size, mime_type, uploaded_by, created_at`,
      [title, description || null, filename, filePath, size, mimetype, uploadedBy]
    );

    res.status(201).json({ success: true, document: result.rows[0] });
  } catch (err) {
    console.error('[ERROR] uploadDocument:', err.message);
    res.status(500).json({ success: false, message: 'Failed to upload document' });
  }
}

async function listDocuments(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, title, description, file_name, file_size, mime_type, uploaded_by, created_at
       FROM documents ORDER BY created_at DESC`
    );
    res.json({ success: true, documents: result.rows });
  } catch (err) {
    console.error('[ERROR] listDocuments:', err.message);
    res.status(500).json({ success: false, message: 'Failed to list documents' });
  }
}

async function downloadDocument(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT file_path, file_name FROM documents WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const { file_path, file_name } = result.rows[0];

    if (!fs.existsSync(file_path)) {
      return res.status(404).json({ success: false, message: 'File missing on server' });
    }

    res.download(file_path, file_name);
  } catch (err) {
    console.error('[ERROR] downloadDocument:', err.message);
    res.status(500).json({ success: false, message: 'Failed to download document' });
  }
}

module.exports = { uploadDocument, listDocuments, downloadDocument };
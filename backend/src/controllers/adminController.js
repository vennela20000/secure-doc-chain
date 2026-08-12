const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const SALT_ROUNDS = 10;

// POST /api/admin/users
// Admin-only. Unlike public /register (Phase 6), this lets the admin
// specify any role explicitly.
async function createUser(req, res) {
  const { fullName, username, email, password, role } = req.body;

  if (!fullName || !username || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'fullName, username, email, password, and role are all required'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  try {
    const roleResult = await pool.query(
      'SELECT id FROM roles WHERE name = $1',
      [role]
    );

    if (roleResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid role "${role}". Must be one of: admin, engineer, reviewer, auditor, viewer`
      });
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already in use'
      });
    }

    const roleId = roleResult.rows[0].id;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const insertResult = await pool.query(
      `INSERT INTO users (full_name, username, email, password_hash, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, username, email, role_id, created_at`,
      [fullName, username, email, passwordHash, roleId]
    );

    console.log(`[INFO] Admin created user: ${username} (role: ${role})`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: insertResult.rows[0]
    });
  } catch (err) {
    console.error('[ERROR] Admin user creation failed:', err.message);
    res.status(500).json({
      success: false,
      message: 'User creation failed due to a server error'
    });
  }
}

// GET /api/admin/users
// Admin-only. Lists all users with their role names.
async function listUsers(req, res) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.username, u.email, u.is_active,
              u.created_at, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      users: result.rows
    });
  } catch (err) {
    console.error('[ERROR] Listing users failed:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to list users'
    });
  }
}

module.exports = { createUser, listUsers };
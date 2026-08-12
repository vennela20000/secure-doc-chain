const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwtUtils');

const SALT_ROUNDS = 10; // cost factor for bcrypt hashing - 10 is a solid, standard default

// POST /api/auth/register
// Public self-registration. New accounts always get the lowest-privilege
// role ("viewer"). Admin-controlled creation of Engineers/Reviewers/etc.
// is built properly in Phase 7 (RBAC) via a separate admin-only endpoint.
async function register(req, res) {
  const { fullName, username, email, password } = req.body;

  // --- Basic input validation ---
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'fullName, username, email, and password are all required'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  try {
    // Check for existing username/email before attempting insert
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

    // Look up the "viewer" role's id
    const roleResult = await pool.query(
      'SELECT id FROM roles WHERE name = $1',
      ['viewer']
    );

    if (roleResult.rows.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Default role "viewer" not found - did you run seed.sql?'
      });
    }

    const viewerRoleId = roleResult.rows[0].id;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const insertResult = await pool.query(
      `INSERT INTO users (full_name, username, email, password_hash, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, username, email, role_id, created_at`,
      [fullName, username, email, passwordHash, viewerRoleId]
    );

    console.log(`[INFO] User registered: ${username}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: insertResult.rows[0]
    });
  } catch (err) {
    console.error('[ERROR] Registration failed:', err.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error'
    });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'username and password are required'
    });
  }

  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.username, u.email, u.password_hash,
              u.is_active, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      // Deliberately vague message - never reveal whether the
      // username or the password was the wrong part.
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const token = generateToken(user);

    console.log(`[INFO] User logged in: ${username}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role_name
      }
    });
  } catch (err) {
    console.error('[ERROR] Login failed:', err.message);
    res.status(500).json({
      success: false,
      message: 'Login failed due to a server error'
    });
  }
}

module.exports = { register, login };
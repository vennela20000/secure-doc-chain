const pool = require('../config/database');

// GET /api/users/me
// Protected route - req.user is set by the requireAuth middleware.
async function getCurrentUser(req, res) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.username, u.email, u.is_active,
              u.created_at, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    console.error('[ERROR] Fetching current user failed:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
}

module.exports = { getCurrentUser };
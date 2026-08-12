const jwt = require('jsonwebtoken');
require('dotenv').config();

// Creates a signed JWT containing the minimum info we need on every request:
// who the user is (id/username) and what role they have (for RBAC in Phase 7).
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role_name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

// Verifies a token's signature and expiry. Throws if invalid/expired -
// the caller (our auth middleware) is responsible for catching that.
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
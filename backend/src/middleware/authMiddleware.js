const { verifyToken } = require('../utils/jwtUtils');

// This middleware runs BEFORE any protected route handler.
// It checks for a valid JWT in the Authorization header and,
// if valid, attaches the decoded user info to req.user so
// every later controller can trust req.user without re-checking.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No authentication token provided'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { userId, username, role }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

module.exports = { requireAuth };
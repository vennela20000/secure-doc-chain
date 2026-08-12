// This middleware runs AFTER requireAuth (which sets req.user).
// It takes a list of allowed roles and blocks the request if
// req.user.role isn't in that list.
//
// Usage: router.post('/users', requireAuth, requireRole('admin'), createUser);
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'No authenticated user found'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: requires one of [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
}

module.exports = { requireRole };
// backend/middleware/roleMiddleware.js

// usage: authorize('teacher'), authorize('admin', 'teacher')
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient privileges' });
    }
    next();
  };
};

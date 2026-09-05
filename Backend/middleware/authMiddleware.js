const jwt = require('jsonwebtoken');

// Verify JWT token from Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user role matches allowed roles
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Case-insensitive comparison and alias support for user/normal
  const userRole = (req.user.role || '').toLowerCase();
  const allowed = roles.map((r) => r.toLowerCase().replace('user', 'normal'));

  if (!allowed.includes(userRole)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }

  next();
};

module.exports = {
  verifyToken,
  requireRole,
};

const jwt = require('jsonwebtoken');
const config = require('../config');
const { unauthorized, forbidden } = require('../utils/response');

// Verify JWT token
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return unauthorized(res);
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return unauthorized(res, '登录已过期，请重新登录');
  }
}

// Require admin role
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return forbidden(res);
  }
  next();
}

// Optional auth — attach user if token present, but don't block
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.slice(7);
      req.user = jwt.verify(token, config.jwtSecret);
    } catch (_) {}
  }
  next();
}

module.exports = { authenticate, requireAdmin, optionalAuth };

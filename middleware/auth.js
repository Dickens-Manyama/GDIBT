const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const token = req.session.adminToken || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'gdbi-admin-secret');
    req.admin = payload;
    return next();
  } catch (error) {
    req.session.adminToken = null;
    return res.redirect('/admin/login');
  }
}

module.exports = { requireAdmin };

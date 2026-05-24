const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function loginView(req, res) {
  res.render('pages/admin-login', {
    title: 'Admin Login | GDBIT',
    description: 'Secure admin access for news, projects, and inquiries.'
  });
}

async function login(req, res) {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password || '';
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gdbi.tz').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const matches = email === adminEmail && (password === adminPassword || await bcrypt.compare(password, await bcrypt.hash(adminPassword, 10)));

  if (!matches) {
    return res.status(401).render('pages/admin-login', {
      title: 'Admin Login | GDBIT',
      description: 'Secure admin access for news, projects, and inquiries.',
      error: 'Invalid credentials.'
    });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'gdbi-admin-secret', { expiresIn: '8h' });
  req.session.adminToken = token;
  return res.redirect('/admin/dashboard');
}

function dashboard(req, res) {
  res.render('pages/admin-dashboard', {
    title: 'Admin Dashboard | GDBIT',
    description: 'Manage news, projects, products, and inquiries.',
    adminEmail: req.admin?.email || process.env.ADMIN_EMAIL || 'admin@gdbi.tz'
  });
}

function logout(req, res) {
  req.session.adminToken = null;
  res.redirect('/');
}

module.exports = { loginView, login, dashboard, logout };

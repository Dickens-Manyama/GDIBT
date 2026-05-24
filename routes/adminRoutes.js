const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.get('/login', adminController.loginView);
router.post('/login', adminController.login);
router.get('/dashboard', requireAdmin, adminController.dashboard);
router.post('/logout', requireAdmin, adminController.logout);

module.exports = router;

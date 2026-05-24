const router = require('express').Router();
const siteController = require('../controllers/siteController');

router.get('/', siteController.home);
router.get('/about', siteController.about);
router.get('/partnership', siteController.partnership);
router.get('/bambooguard', siteController.bambooguard);
router.get('/manufacturing', siteController.manufacturing);
router.get('/impact', siteController.impact);
router.get('/investment', siteController.investment);
router.get('/invest-impact', siteController.investImpactContact);
router.get('/team', siteController.team);
router.get('/phases', siteController.phases);
router.get('/innovation', siteController.innovation);
router.get('/contact', siteController.contact);
router.post('/contact', siteController.submitContact);

module.exports = router;

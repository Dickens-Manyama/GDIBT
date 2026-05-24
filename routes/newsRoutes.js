const router = require('express').Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.index);
router.get('/:slug', newsController.show);

module.exports = router;

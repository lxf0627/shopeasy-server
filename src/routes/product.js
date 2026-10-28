const router = require('express').Router();
const ctrl = require('../controllers/productController');

router.get('/', ctrl.list);
router.get('/search', ctrl.search);
router.get('/categories', ctrl.categories);
router.get('/:id', ctrl.detail);

module.exports = router;

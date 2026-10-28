const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, ctrl.create);
router.get('/product/:productId', ctrl.listByProduct);

module.exports = router;

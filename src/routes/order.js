const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);
router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.detail);
router.put('/:id/cancel', ctrl.cancel);
router.put('/:id/confirm', ctrl.confirm);
router.post('/:id/pay', ctrl.pay);

module.exports = router;

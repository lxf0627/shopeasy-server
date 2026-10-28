const router = require('express').Router();
const ctrl = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);
router.get('/', ctrl.list);
router.post('/', ctrl.add);
router.put('/select-all', ctrl.selectAll);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;

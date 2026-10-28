const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/user/profile', authenticate, ctrl.getProfile);
router.put('/user/profile', authenticate, ctrl.updateProfile);
router.put('/user/password', authenticate, ctrl.changePassword);

module.exports = router;

const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middlewares/auth');

router.use(authenticate, requireAdmin);

// Products
router.get('/products', ctrl.productList);
router.post('/products', ctrl.createProduct);
router.put('/products/:id', ctrl.updateProduct);
router.put('/products/:id/status', ctrl.toggleProductStatus);

// Categories
router.post('/categories', ctrl.createCategory);
router.put('/categories/:id', ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

// Orders
router.get('/orders', ctrl.orderList);
router.put('/orders/:id/ship', ctrl.shipOrder);
router.put('/orders/:id/refund', ctrl.refundOrder);

// Users
router.get('/users', ctrl.userList);
router.put('/users/:id/status', ctrl.toggleUserStatus);

// Reviews
router.get('/reviews', ctrl.reviewList);
router.delete('/reviews/:id', ctrl.deleteReview);

// Stats
router.get('/stats', ctrl.stats);

module.exports = router;

const Joi = require('joi');
const { Review, Product, User, Order } = require('../models');
const { success, fail, notFound, paginate, parsePagination } = require('../utils/response');

const reviewSchema = Joi.object({
  orderId: Joi.number().integer().required(),
  productId: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  content: Joi.string().max(1000).allow('', null),
  images: Joi.array().items(Joi.string().uri()).default([]),
});

async function create(req, res, next) {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const order = Order.findOne({ where: { id: value.orderId, userId: req.user.id } });
    if (!order) return fail(res, '订单不存在');
    if (!['received', 'completed'].includes(order.status)) return fail(res, '订单状态不允许评价');

    const exists = Review.findOne({ where: { userId: req.user.id, orderId: value.orderId, productId: value.productId } });
    if (exists) return fail(res, '已评价过该商品');

    const review = Review.create({
      ...value,
      images: JSON.stringify(value.images),
      userId: req.user.id,
    });

    // Update product average rating
    const allReviews = Review.findAll({ where: { productId: value.productId } });
    if (allReviews.length) {
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      Product.update({ rating: Math.round(avg * 10) / 10 }, { where: { id: value.productId } });
    }

    success(res, review, '评价成功', 201);
  } catch (err) { next(err); }
}

async function listByProduct(req, res, next) {
  try {
    const { page, pageSize, limit, offset } = parsePagination(req.query);

    const allReviews = Review.findAll({ where: { productId: Number(req.params.productId) }, order: ['createdAt', 'DESC'] });
    const total = allReviews.length;
    const list = allReviews.slice(offset, offset + limit).map((r) => {
      const user = User.findByPk(r.userId);
      return {
        ...r,
        images: tryParse(r.images),
        User: user ? { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar } : null,
      };
    });

    paginate(res, { list, total, page, pageSize });
  } catch (err) { next(err); }
}

function tryParse(str) {
  try { return JSON.parse(str); } catch (_) { return []; }
}

module.exports = { create, listByProduct };
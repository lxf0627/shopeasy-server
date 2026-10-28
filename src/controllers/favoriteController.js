const Joi = require('joi');
const { Favorite, Product, Category } = require('../models');
const { success, fail, notFound, paginate, parsePagination } = require('../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, offset } = parsePagination(req.query);

    const allFavs = Favorite.findAll({ where: { userId: req.user.id }, order: ['createdAt', 'DESC'] });
    const total = allFavs.length;
    const list = allFavs.slice(offset, offset + limit).map((f) => {
      const product = Product.findByPk(f.productId);
      return {
        ...f,
        Product: product ? { ...product, images: tryParse(product.images), Category: Category.findByPk(product.categoryId) } : null,
      };
    });

    paginate(res, { list, total, page, pageSize });
  } catch (err) { next(err); }
}

async function add(req, res, next) {
  try {
    const schema = Joi.object({
      productId: Joi.number().integer().required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const product = Product.findByPk(value.productId);
    if (!product) return notFound(res, '商品不存在');

    const existing = Favorite.findOne({ where: { userId: req.user.id, productId: value.productId } });
    if (existing) return success(res, existing, '已收藏');

    const fav = Favorite.create({ userId: req.user.id, productId: value.productId });
    success(res, fav, '收藏成功', 201);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = Favorite.destroy({ where: { userId: req.user.id, productId: Number(req.params.productId) } });
    if (!deleted) return notFound(res);
    success(res, null, '已取消收藏');
  } catch (err) { next(err); }
}

function tryParse(str) {
  try { return JSON.parse(str); } catch (_) { return []; }
}

module.exports = { list, add, remove };
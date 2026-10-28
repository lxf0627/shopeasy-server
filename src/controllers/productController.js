const { Product, ProductSku, Category, Review, User } = require('../models');
const { success, fail, notFound, paginate, parsePagination } = require('../utils/response');
const { Op } = require('../models/db');

// GET /api/products
async function list(req, res, next) {
  try {
    const { categoryId, keyword, minPrice, maxPrice, sort } = req.query;
    const { page, pageSize, limit, offset } = parsePagination(req.query);
    const where = { status: 'on' };

    if (categoryId) where.categoryId = Number(categoryId);
    if (keyword) where.name = Op.like(`%${keyword}%`);

    let order = ['createdAt', 'DESC'];
    if (sort === 'price_asc') order = ['price', 'ASC'];
    else if (sort === 'price_desc') order = ['price', 'DESC'];
    else if (sort === 'sales') order = ['salesCount', 'DESC'];
    else if (sort === 'rating') order = ['rating', 'DESC'];

    // Get all matching first, then apply price filter manually
    let allProducts = Product.findAll({ where, order });

    if (minPrice) allProducts = allProducts.filter((p) => Number(p.price) >= Number(minPrice));
    if (maxPrice) allProducts = allProducts.filter((p) => Number(p.price) <= Number(maxPrice));

    const total = allProducts.length;
    const listItems = allProducts.slice(offset, offset + limit).map((p) => ({
      ...p,
      images: tryParse(p.images),
      Category: Category.findByPk(p.categoryId),
    }));

    paginate(res, { list: listItems, total, page, pageSize });
  } catch (err) { next(err); }
}

// GET /api/products/:id
async function detail(req, res, next) {
  try {
    const product = Product.findByPk(Number(req.params.id));
    if (!product) return notFound(res);

    const reviews = Review.findAll({ where: { productId: product.id } }).map((r) => ({
      ...r,
      images: tryParse(r.images),
      User: (() => { const u = User.findByPk(r.userId); return u ? { id: u.id, username: u.username, nickname: u.nickname, avatar: u.avatar } : null; })(),
    }));

    const skus = ProductSku.findAll({ where: { productId: product.id } });

    success(res, {
      ...product,
      images: tryParse(product.images),
      specGroups: tryParse(product.specGroups),
      skus,
      Category: Category.findByPk(product.categoryId),
      reviews,
    });
  } catch (err) { next(err); }
}

// GET /api/categories
async function categories(req, res, next) {
  try {
    const cats = Category.findAll({ order: ['sortOrder', 'ASC'] });
    success(res, cats);
  } catch (err) { next(err); }
}

// GET /api/products/search
async function search(req, res, next) {
  req.query.keyword = req.query.q;
  return list(req, res, next);
}

function tryParse(str) {
  try { return JSON.parse(str); } catch (_) { return []; }
}

module.exports = { list, detail, categories, search };
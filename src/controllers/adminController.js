const Joi = require('joi');
const { Product, ProductSku, Category, Order, OrderItem, User, Review, Payment } = require('../models');
const { success, fail, notFound, paginate, parsePagination } = require('../utils/response');

// ===== Product Management =====

async function productList(req, res, next) {
  try {
    const { status, categoryId, keyword } = req.query;
    const { page, pageSize, limit, offset } = parsePagination(req.query);
    const where = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = Number(categoryId);

    let products = Product.findAll({ where, order: ['createdAt', 'DESC'] });
    if (keyword) products = products.filter((p) => p.name.includes(keyword));

    const total = products.length;
    const list = products.slice(offset, offset + limit).map((p) => ({
      ...p,
      images: tryParse(p.images),
      specGroups: tryParse(p.specGroups),
      skus: ProductSku.findAll({ where: { productId: p.id } }),
      Category: Category.findByPk(p.categoryId),
    }));

    paginate(res, { list, total, page, pageSize });
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    const skuSchema = Joi.object({
      specs: Joi.object().pattern(Joi.string(), Joi.string()).required(),
      price: Joi.number().positive().required(),
      originalPrice: Joi.number().positive().allow(null),
      stock: Joi.number().integer().min(0).required(),
      image: Joi.string().allow('', null),
    });
    const specGroupSchema = Joi.object({
      name: Joi.string().required(),
      values: Joi.array().items(Joi.string()).min(1).required(),
    });
    const schema = Joi.object({
      name: Joi.string().max(200).required(),
      description: Joi.string().allow('', null),
      price: Joi.number().positive().required(),
      originalPrice: Joi.number().positive().allow(null),
      stock: Joi.number().integer().min(0).required(),
      categoryId: Joi.number().integer().required(),
      images: Joi.array().items(Joi.string()).min(1).required(),
      status: Joi.string().valid('on', 'off').default('on'),
      specGroups: Joi.array().items(specGroupSchema).default([]),
      skus: Joi.array().items(skuSchema).default([]),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const hasSpec = value.specGroups.length > 0 && value.skus.length > 0;
    const product = Product.create({
      name: value.name,
      description: value.description || '',
      price: value.price,
      originalPrice: value.originalPrice,
      stock: value.stock,
      categoryId: value.categoryId,
      images: JSON.stringify(value.images),
      status: value.status,
      specGroups: JSON.stringify(value.specGroups),
      hasSpec,
      salesCount: 0,
      rating: 5.0,
    });

    // Create SKUs
    if (hasSpec) {
      for (const sku of value.skus) {
        const specText = Object.values(sku.specs).join(' / ');
        ProductSku.create({
          productId: product.id,
          specs: sku.specs,
          specText,
          price: sku.price,
          originalPrice: sku.originalPrice,
          stock: sku.stock,
          image: sku.image || '',
        });
      }
    }

    success(res, product, '创建成功', 201);
  } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
  try {
    const product = Product.findByPk(Number(req.params.id));
    if (!product) return notFound(res);

    const skuSchema = Joi.object({
      id: Joi.number().integer().allow(null),
      specs: Joi.object().pattern(Joi.string(), Joi.string()).required(),
      price: Joi.number().positive().required(),
      originalPrice: Joi.number().positive().allow(null),
      stock: Joi.number().integer().min(0).required(),
      image: Joi.string().allow('', null),
    });
    const specGroupSchema = Joi.object({
      name: Joi.string().required(),
      values: Joi.array().items(Joi.string()).min(1).required(),
    });
    const schema = Joi.object({
      name: Joi.string().max(200),
      description: Joi.string().allow('', null),
      price: Joi.number().positive(),
      originalPrice: Joi.number().positive().allow(null),
      stock: Joi.number().integer().min(0),
      categoryId: Joi.number().integer(),
      images: Joi.array().items(Joi.string()),
      status: Joi.string().valid('on', 'off'),
      specGroups: Joi.array().items(specGroupSchema),
      skus: Joi.array().items(skuSchema),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const updateData = {};
    for (const key of ['name', 'description', 'price', 'originalPrice', 'stock', 'categoryId', 'status']) {
      if (value[key] !== undefined) updateData[key] = value[key];
    }
    if (value.images) updateData.images = JSON.stringify(value.images);
    if (value.specGroups) {
      updateData.specGroups = JSON.stringify(value.specGroups);
      updateData.hasSpec = value.specGroups.length > 0 && (value.skus || []).length > 0;
    }
    Product.update(updateData, { where: { id: product.id } });

    // Update SKUs if provided
    if (value.skus) {
      // Delete old SKUs
      ProductSku.destroy({ where: { productId: product.id } });
      // Create new SKUs
      for (const sku of value.skus) {
        const specText = Object.values(sku.specs).join(' / ');
        ProductSku.create({
          productId: product.id,
          specs: sku.specs,
          specText,
          price: sku.price,
          originalPrice: sku.originalPrice,
          stock: sku.stock,
          image: sku.image || '',
        });
      }
    }

    success(res, { ...product, ...updateData }, '更新成功');
  } catch (err) { next(err); }
}

async function toggleProductStatus(req, res, next) {
  try {
    const product = Product.findByPk(Number(req.params.id));
    if (!product) return notFound(res);
    const newStatus = product.status === 'on' ? 'off' : 'on';
    Product.update({ status: newStatus }, { where: { id: product.id } });
    success(res, { ...product, status: newStatus }, newStatus === 'on' ? '已上架' : '已下架');
  } catch (err) { next(err); }
}

// ===== Order Management =====

async function orderList(req, res, next) {
  try {
    const { status, orderNo } = req.query;
    const { page, pageSize, limit, offset } = parsePagination(req.query);
    const where = {};
    if (status) where.status = status;

    let orders = Order.findAll({ where, order: ['createdAt', 'DESC'] });
    if (orderNo) orders = orders.filter((o) => o.orderNo.includes(orderNo));

    const total = orders.length;
    const list = orders.slice(offset, offset + limit).map((o) => ({
      ...o,
      OrderItems: OrderItem.findAll({ where: { orderId: o.id } }),
      User: (() => { const u = User.findByPk(o.userId); return u ? { id: u.id, username: u.username, nickname: u.nickname } : null; })(),
    }));

    paginate(res, { list, total, page, pageSize });
  } catch (err) { next(err); }
}

async function shipOrder(req, res, next) {
  try {
    const order = Order.findByPk(Number(req.params.id));
    if (!order) return notFound(res);
    if (order.status !== 'paid') return fail(res, '只能发货已支付的订单');
    Order.update({ status: 'shipped', shipTime: new Date().toISOString() }, { where: { id: order.id } });
    success(res, { ...order, status: 'shipped' }, '已发货');
  } catch (err) { next(err); }
}

async function refundOrder(req, res, next) {
  try {
    const order = Order.findByPk(Number(req.params.id));
    if (!order) return notFound(res);
    if (!['paid', 'shipped', 'refunding'].includes(order.status)) return fail(res, '订单状态不支持退款');

    const items = OrderItem.findAll({ where: { orderId: order.id } });
    for (const item of items) {
      const p = Product.findByPk(item.productId);
      if (p) Product.update({ stock: p.stock + item.quantity }, { where: { id: item.productId } });
    }

    Order.update({ status: 'refunded' }, { where: { id: order.id } });
    success(res, { ...order, status: 'refunded' }, '已退款');
  } catch (err) { next(err); }
}

// ===== User Management =====

async function userList(req, res, next) {
  try {
    const { keyword, status } = req.query;
    const { page, pageSize, limit, offset } = parsePagination(req.query);
    const where = {};
    if (status) where.status = status;

    let users = User.findAll({ where });
    if (keyword) users = users.filter((u) => u.username.includes(keyword) || (u.nickname || '').includes(keyword));

    const total = users.length;
    const list = users.slice(offset, offset + limit).map(({ password, ...safe }) => safe);

    paginate(res, { list, total, page, pageSize });
  } catch (err) { next(err); }
}

async function toggleUserStatus(req, res, next) {
  try {
    const user = User.findByPk(Number(req.params.id));
    if (!user) return notFound(res);
    if (user.role === 'admin') return fail(res, '不能禁用管理员');
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    User.update({ status: newStatus }, { where: { id: user.id } });
    success(res, { id: user.id, status: newStatus }, newStatus === 'active' ? '已启用' : '已禁用');
  } catch (err) { next(err); }
}

// ===== Stats =====

async function stats(req, res, next) {
  try {
    const totalUsers = User.count();
    const totalProducts = Product.count();
    const totalOrders = Order.count();
    const paidStatuses = ['paid', 'shipped', 'received', 'completed'];
    const paidOrders = Order.findAll().filter((o) => paidStatuses.includes(o.status)).length;
    const totalRevenue = Order.findAll()
      .filter((o) => paidStatuses.includes(o.status))
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const recentOrders = Order.findAll({ order: ['createdAt', 'DESC'] }).slice(0, 5).map((o) => {
      const u = User.findByPk(o.userId);
      return { ...o, User: u ? { username: u.username } : null };
    });

    success(res, { totalUsers, totalProducts, totalOrders, paidOrders, totalRevenue, recentOrders });
  } catch (err) { next(err); }
}

// ===== Category Management =====

async function createCategory(req, res, next) {
  try {
    const schema = Joi.object({
      name: Joi.string().max(50).required(),
      icon: Joi.string().allow('', null),
      sortOrder: Joi.number().integer().default(0),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);
    const cat = Category.create(value);
    success(res, cat, '创建成功', 201);
  } catch (err) { next(err); }
}

async function updateCategory(req, res, next) {
  try {
    const cat = Category.findByPk(Number(req.params.id));
    if (!cat) return notFound(res);
    const schema = Joi.object({
      name: Joi.string().max(50),
      icon: Joi.string().allow('', null),
      sortOrder: Joi.number().integer(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);
    Category.update(value, { where: { id: cat.id } });
    success(res, { ...cat, ...value }, '更新成功');
  } catch (err) { next(err); }
}

async function deleteCategory(req, res, next) {
  try {
    const cat = Category.findByPk(Number(req.params.id));
    if (!cat) return notFound(res);
    Category.destroy({ where: { id: cat.id } });
    success(res, null, '已删除');
  } catch (err) { next(err); }
}

// ===== Review Management =====

async function reviewList(req, res, next) {
  try {
    const { page, pageSize, limit, offset } = parsePagination(req.query);
    const allReviews = Review.findAll({ order: ['createdAt', 'DESC'] });
    const total = allReviews.length;
    const list = allReviews.slice(offset, offset + limit).map((r) => ({
      ...r,
      User: (() => { const u = User.findByPk(r.userId); return u ? { id: u.id, username: u.username, nickname: u.nickname } : null; })(),
      Product: (() => { const p = Product.findByPk(r.productId); return p ? { id: p.id, name: p.name } : null; })(),
    }));
    paginate(res, { list, total, page, pageSize });
  } catch (err) { next(err); }
}

async function deleteReview(req, res, next) {
  try {
    const review = Review.findByPk(Number(req.params.id));
    if (!review) return notFound(res);
    Review.destroy({ where: { id: review.id } });
    success(res, null, '已删除');
  } catch (err) { next(err); }
}

function tryParse(str) {
  try { return JSON.parse(str); } catch (_) { return []; }
}

module.exports = {
  productList, createProduct, updateProduct, toggleProductStatus,
  orderList, shipOrder, refundOrder,
  userList, toggleUserStatus,
  stats,
  createCategory, updateCategory, deleteCategory,
  reviewList, deleteReview,
};
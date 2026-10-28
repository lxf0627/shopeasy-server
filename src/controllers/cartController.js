const Joi = require('joi');
const { CartItem, Product, ProductSku, Category } = require('../models');
const { success, fail, notFound } = require('../utils/response');

// GET /api/cart
async function list(req, res, next) {
  try {
    const items = CartItem.findAll({ where: { userId: req.user.id } }).map((item) => {
      const product = Product.findByPk(item.productId);
      const sku = item.skuId ? ProductSku.findByPk(item.skuId) : null;
      return {
        ...item,
        Product: product ? { ...product, images: tryParse(product.images), Category: Category.findByPk(product.categoryId) } : null,
        Sku: sku || null,
      };
    });
    success(res, items);
  } catch (err) { next(err); }
}

// POST /api/cart
async function add(req, res, next) {
  try {
    const schema = Joi.object({
      productId: Joi.number().integer().required(),
      skuId: Joi.number().integer().allow(null),
      quantity: Joi.number().integer().min(1).default(1),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const product = Product.findByPk(value.productId);
    if (!product) return notFound(res, '商品不存在');
    if (product.status !== 'on') return fail(res, '商品已下架');

    // Validate SKU
    let sku = null;
    if (product.hasSpec) {
      if (!value.skuId) return fail(res, '请选择商品规格');
      sku = ProductSku.findByPk(value.skuId);
      if (!sku || sku.productId !== product.id) return fail(res, '规格不存在');
      if (sku.stock < value.quantity) return fail(res, '库存不足');
    } else {
      if (product.stock < value.quantity) return fail(res, '库存不足');
    }

    // Check existing (same product + same SKU)
    const existing = CartItem.findOne({
      where: { userId: req.user.id, productId: value.productId, skuId: value.skuId || null },
    });
    if (existing) {
      const maxStock = sku ? sku.stock : product.stock;
      const newQty = existing.quantity + value.quantity;
      if (newQty > maxStock) return fail(res, '库存不足');
      CartItem.update({ quantity: newQty }, { where: { id: existing.id } });
      return success(res, { ...existing, quantity: newQty }, '已更新购物车数量');
    }

    const item = CartItem.create({
      userId: req.user.id,
      productId: value.productId,
      skuId: value.skuId || null,
      specText: sku ? sku.specText : '',
      quantity: value.quantity,
      selected: true,
    });
    success(res, item, '已加入购物车', 201);
  } catch (err) { next(err); }
}

// PUT /api/cart/:id
async function update(req, res, next) {
  try {
    const schema = Joi.object({
      quantity: Joi.number().integer().min(1),
      selected: Joi.boolean(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const item = CartItem.findOne({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!item) return notFound(res, '购物车项不存在');

    if (value.quantity) {
      const product = Product.findByPk(item.productId);
      const sku = item.skuId ? ProductSku.findByPk(item.skuId) : null;
      const maxStock = sku ? sku.stock : product.stock;
      if (value.quantity > maxStock) return fail(res, '库存不足');
    }

    CartItem.update(value, { where: { id: item.id } });
    success(res, { ...item, ...value }, '更新成功');
  } catch (err) { next(err); }
}

// DELETE /api/cart/:id
async function remove(req, res, next) {
  try {
    const deleted = CartItem.destroy({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!deleted) return notFound(res);
    success(res, null, '已删除');
  } catch (err) { next(err); }
}

// PUT /api/cart/select-all
async function selectAll(req, res, next) {
  try {
    const { selected = true } = req.body;
    CartItem.update({ selected }, { where: { userId: req.user.id } });
    success(res, null, selected ? '已全选' : '已取消全选');
  } catch (err) { next(err); }
}

function tryParse(str) {
  try { return JSON.parse(str); } catch (_) { return []; }
}

module.exports = { list, add, update, remove, selectAll };

const Joi = require('joi');
const { Order, OrderItem, CartItem, Product, ProductSku, Address, Payment } = require('../models');
const { success, fail, notFound, paginate, parsePagination } = require('../utils/response');

function genOrderNo() {
  return 'ORD' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// POST /api/orders
async function create(req, res, next) {
  try {
    const schema = Joi.object({
      addressId: Joi.number().integer().required(),
      remark: Joi.string().max(500).allow('', null),
      couponId: Joi.number().integer().allow(null),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const address = Address.findOne({ where: { id: value.addressId, userId: req.user.id } });
    if (!address) return fail(res, '收货地址不存在');

    const cartItems = CartItem.findAll({ where: { userId: req.user.id, selected: true } });
    if (!cartItems.length) return fail(res, '请选择商品');

    let totalAmount = 0;
    const orderItemsData = [];

    for (const ci of cartItems) {
      const product = Product.findByPk(ci.productId);
      if (!product || product.status !== 'on') return fail(res, `"${product?.name || '未知商品'}"已下架`);

      // Use SKU price/stock if applicable
      const sku = ci.skuId ? ProductSku.findByPk(ci.skuId) : null;
      const price = sku ? Number(sku.price) : Number(product.price);
      const maxStock = sku ? sku.stock : product.stock;

      if (ci.quantity > maxStock) return fail(res, `"${product.name}"库存不足`);
      totalAmount += price * ci.quantity;
      orderItemsData.push({
        productId: product.id,
        skuId: ci.skuId || null,
        quantity: ci.quantity,
        price,
        productName: product.name,
        productImage: sku?.image || tryParse(product.images)[0] || '',
        specText: ci.specText || '',
      });
    }

    const order = Order.create({
      orderNo: genOrderNo(),
      userId: req.user.id,
      totalAmount,
      status: 'pending',
      addressSnapshot: JSON.stringify(address),
      remark: value.remark || '',
      couponId: value.couponId,
    });

    for (const item of orderItemsData) {
      OrderItem.create({ orderId: order.id, ...item });
      const p = Product.findByPk(item.productId);
      Product.update({ stock: p.stock - item.quantity, salesCount: (p.salesCount || 0) + item.quantity }, { where: { id: item.productId } });
    }

    CartItem.destroy({ where: { userId: req.user.id, selected: true } });

    success(res, order, '订单创建成功', 201);
  } catch (err) { next(err); }
}

// GET /api/orders
async function list(req, res, next) {
  try {
    const { status } = req.query;
    const { page, pageSize, limit, offset } = parsePagination(req.query);
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const allOrders = Order.findAll({ where, order: ['createdAt', 'DESC'] });
    const total = allOrders.length;
    const listItems = allOrders.slice(offset, offset + limit).map((o) => ({
      ...o,
      OrderItems: OrderItem.findAll({ where: { orderId: o.id } }),
    }));

    paginate(res, { list: listItems, total, page, pageSize });
  } catch (err) { next(err); }
}

// GET /api/orders/:id
async function detail(req, res, next) {
  try {
    const order = Order.findOne({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!order) return notFound(res, '订单不存在');

    success(res, {
      ...order,
      addressSnapshot: tryParse(order.addressSnapshot),
      OrderItems: OrderItem.findAll({ where: { orderId: order.id } }),
      Payment: Payment.findOne({ where: { orderId: order.id } }),
    });
  } catch (err) { next(err); }
}

// PUT /api/orders/:id/cancel
async function cancel(req, res, next) {
  try {
    const order = Order.findOne({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!order) return notFound(res);
    if (order.status !== 'pending') return fail(res, '只能取消待支付的订单');

    Order.update({ status: 'cancelled' }, { where: { id: order.id } });

    const items = OrderItem.findAll({ where: { orderId: order.id } });
    for (const item of items) {
      const p = Product.findByPk(item.productId);
      if (p) Product.update({ stock: p.stock + item.quantity, salesCount: Math.max(0, (p.salesCount || 0) - item.quantity) }, { where: { id: item.productId } });
    }

    success(res, { ...order, status: 'cancelled' }, '订单已取消');
  } catch (err) { next(err); }
}

// PUT /api/orders/:id/confirm
async function confirm(req, res, next) {
  try {
    const order = Order.findOne({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!order) return notFound(res);
    if (order.status !== 'shipped') return fail(res, '只能确认已发货的订单');

    Order.update({ status: 'received', receiveTime: new Date().toISOString() }, { where: { id: order.id } });
    success(res, { ...order, status: 'received' }, '已确认收货');
  } catch (err) { next(err); }
}

// POST /api/orders/:id/pay
async function pay(req, res, next) {
  try {
    const schema = Joi.object({
      method: Joi.string().valid('alipay', 'wechat', 'balance').required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const order = Order.findOne({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!order) return notFound(res);
    if (order.status !== 'pending') return fail(res, '订单状态不支持支付');

    const payment = Payment.create({
      orderId: order.id,
      method: value.method,
      amount: order.totalAmount,
      status: 'success',
      paidAt: new Date().toISOString(),
    });

    Order.update({ status: 'paid', payTime: new Date().toISOString() }, { where: { id: order.id } });
    success(res, { order: { ...order, status: 'paid' }, payment }, '支付成功');
  } catch (err) { next(err); }
}

function tryParse(str) {
  try { return typeof str === 'string' ? JSON.parse(str) : str; } catch (_) { return {}; }
}

module.exports = { create, list, detail, cancel, confirm, pay };
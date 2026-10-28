const Joi = require('joi');
const { Address } = require('../models');
const { success, fail, notFound } = require('../utils/response');

const addressSchema = Joi.object({
  name: Joi.string().max(50).required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required(),
  province: Joi.string().max(50).required(),
  city: Joi.string().max(50).required(),
  district: Joi.string().max(50).required(),
  detail: Joi.string().max(200).required(),
  isDefault: Joi.boolean().default(false),
});

async function list(req, res, next) {
  try {
    const addresses = Address.findAll({
      where: { userId: req.user.id },
      order: ['isDefault', 'DESC'],
    });
    success(res, addresses);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { error, value } = addressSchema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    if (value.isDefault) {
      Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }
    const count = Address.count({ where: { userId: req.user.id } });
    if (count === 0) value.isDefault = true;

    const address = Address.create({ ...value, userId: req.user.id });
    success(res, address, '添加成功', 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { error, value } = addressSchema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const address = Address.findOne({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!address) return notFound(res);

    if (value.isDefault) {
      Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }
    Address.update(value, { where: { id: address.id } });
    success(res, { ...address, ...value }, '更新成功');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = Address.destroy({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!deleted) return notFound(res);
    success(res, null, '已删除');
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };

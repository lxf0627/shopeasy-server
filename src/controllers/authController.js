const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../models');
const config = require('../config');
const { success, fail, unauthorized } = require('../utils/response');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(50).required(),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).allow('', null),
  nickname: Joi.string().max(50).allow('', null),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const exists = User.findOne({ where: { username: value.username } });
    if (exists) return fail(res, '用户名已存在');

    const password = await bcrypt.hash(value.password, config.saltRounds);
    const user = User.create({ ...value, password });

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    success(res, { token, user: { id: user.id, username: user.username, role: user.role, nickname: user.nickname } }, '注册成功', 201);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const user = User.findOne({ where: { username: value.username } });
    if (!user) return unauthorized(res, '用户名或密码错误');

    if (user.status === 'disabled') return fail(res, '账号已被禁用', 403);

    const valid = await bcrypt.compare(value.password, user.password);
    if (!valid) return unauthorized(res, '用户名或密码错误');

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    success(res, {
      token,
      user: { id: user.id, username: user.username, role: user.role, nickname: user.nickname, avatar: user.avatar },
    }, '登录成功');
  } catch (err) { next(err); }
}

async function getProfile(req, res, next) {
  try {
    const user = User.findByPk(req.user.id);
    if (!user) return fail(res, '用户不存在', 404);
    const { password, ...safe } = user;
    success(res, safe);
  } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
  try {
    const schema = Joi.object({
      nickname: Joi.string().max(50),
      email: Joi.string().email().allow('', null),
      phone: Joi.string().pattern(/^1[3-9]\d{9}$/).allow('', null),
      avatar: Joi.string().uri().allow('', null),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    User.update(value, { where: { id: req.user.id } });
    const user = User.findByPk(req.user.id);
    const { password, ...safe } = user;
    success(res, safe, '更新成功');
  } catch (err) { next(err); }
}

async function changePassword(req, res, next) {
  try {
    const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).max(50).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return fail(res, error.details[0].message);

    const user = User.findByPk(req.user.id);
    const valid = await bcrypt.compare(value.oldPassword, user.password);
    if (!valid) return fail(res, '原密码错误');

    const hashed = await bcrypt.hash(value.newPassword, config.saltRounds);
    User.update({ password: hashed }, { where: { id: req.user.id } });
    success(res, null, '密码修改成功');
  } catch (err) { next(err); }
}

module.exports = { register, login, getProfile, updateProfile, changePassword };

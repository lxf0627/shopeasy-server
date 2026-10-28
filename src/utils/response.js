/**
 * Unified API response helpers
 */

function success(res, data = null, message = 'ok', code = 200) {
  return res.status(code).json({ code, message, data });
}

function created(res, data = null, message = '创建成功') {
  return success(res, data, message, 201);
}

function fail(res, message = 'error', code = 400, data = null) {
  return res.status(code).json({ code, message, data });
}

function unauthorized(res, message = '未登录或登录已过期') {
  return res.status(401).json({ code: 401, message, data: null });
}

function forbidden(res, message = '无权限访问') {
  return res.status(403).json({ code: 403, message, data: null });
}

function notFound(res, message = '资源不存在') {
  return res.status(404).json({ code: 404, message, data: null });
}

function paginate(res, { list, total, page, pageSize }) {
  return res.json({
    code: 200,
    message: 'ok',
    data: { list, total, page: Number(page), pageSize: Number(pageSize) },
  });
}

/**
 * Parse and sanitize pagination query params in one place.
 * Returns { page, pageSize, limit, offset } with safe integer bounds.
 */
function parsePagination(query = {}, { defaultPageSize = 10, maxPageSize = 100 } = {}) {
  let page = Number.parseInt(query.page, 10);
  let pageSize = Number.parseInt(query.pageSize, 10);
  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(pageSize) || pageSize < 1) pageSize = defaultPageSize;
  if (pageSize > maxPageSize) pageSize = maxPageSize;
  return { page, pageSize, limit: pageSize, offset: (page - 1) * pageSize };
}

module.exports = { success, created, fail, unauthorized, forbidden, notFound, paginate, parsePagination };
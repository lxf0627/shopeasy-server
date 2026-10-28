const { fail } = require('../utils/response');

/**
 * Central error handler.
 * Every response keeps the unified { code, message, data } shape.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // Malformed JSON body (body-parser)
  if (err.type === 'entity.parse.failed') {
    return fail(res, '请求体不是合法的 JSON', 400);
  }

  // Request body too large (body-parser)
  if (err.type === 'entity.too.large') {
    return fail(res, '请求体过大', 413);
  }

  // Multer (file upload) errors
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? '文件大小不能超过 5MB' : '文件上传失败';
    return fail(res, message, 400);
  }

  // Errors raised on purpose (with an explicit status code) keep their message
  const status =
    Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : Number.isInteger(err.status) && err.status >= 400 && err.status < 600
        ? err.status
        : 500;

  if (status >= 500) {
    console.error(`[Error] ${req.method} ${req.originalUrl}`, err.stack || err);
    return fail(res, '服务器内部错误', 500);
  }

  console.warn(`[Warn] ${req.method} ${req.originalUrl} -> ${status} ${err.message}`);
  return fail(res, err.message || '请求失败', status);
}

module.exports = errorHandler;
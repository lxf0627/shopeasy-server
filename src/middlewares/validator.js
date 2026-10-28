const { fail } = require('../utils/response');

/**
 * Validate request body against a Joi schema.
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], { abortEarly: false });
    if (error) {
      const msg = error.details.map((d) => d.message).join('; ');
      return fail(res, msg, 400);
    }
    next();
  };
}

module.exports = validate;

const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/** Collects express-validator errors and turns them into a 400 ApiError. */
module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return next(ApiError.badRequest('Validation failed', details));
};

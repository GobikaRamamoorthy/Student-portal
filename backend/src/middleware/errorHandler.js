const env = require('../config/env');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  }

  const body = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (err.details) body.details = err.details;
  if (!env.isProd && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
};

const ApiError = require('../utils/ApiError');
const token = require('../utils/token');
const userModel = require('../models/userModel');

/** Verifies the Bearer token and attaches the current user to req.user. */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, value] = header.split(' ');

  if (scheme !== 'Bearer' || !value) {
    return next(ApiError.unauthorized('Missing or malformed Authorization header'));
  }

  try {
    const payload = token.verify(value);
    const user = userModel.findById(payload.sub);
    if (!user) return next(ApiError.unauthorized('Account no longer exists'));
    req.user = userModel.sanitize(user);
    return next();
  } catch (err) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
}

/** Restricts a route to one or more roles. Use after authenticate. */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have access to this resource'));
    }
    return next();
  };
}

module.exports = { authenticate, authorize };

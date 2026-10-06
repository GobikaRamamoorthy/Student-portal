const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const token = require('../utils/token');
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');

/** POST /api/auth/login */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = userModel.findByEmail(email);
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw ApiError.unauthorized('Invalid email or password');

  const accessToken = token.sign({ sub: user.id, role: user.role });

  res.json({
    success: true,
    token: accessToken,
    user: userModel.sanitize(user),
  });
});

/** GET /api/auth/me */
const me = asyncHandler(async (req, res) => {
  const payload = { user: req.user };

  if (req.user.role === 'student') {
    payload.student = studentModel.findByUserId(req.user.id);
  }

  res.json({ success: true, ...payload });
});

module.exports = { login, me };

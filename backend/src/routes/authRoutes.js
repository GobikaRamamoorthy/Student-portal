const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.get('/me', authenticate, authController.me);

module.exports = router;

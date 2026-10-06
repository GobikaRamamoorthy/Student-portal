const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const requestController = require('../controllers/requestController');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize('student'),
  [
    body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
    body('field').isString().notEmpty().withMessage('Field is required'),
    body('requestedValue').exists().withMessage('Requested value is required'),
    body('reason').optional().isString(),
  ],
  validate,
  requestController.create
);

router.get('/', requestController.list);

router.patch(
  '/:id',
  authorize('admin'),
  [body('action').isIn(['accept', 'reject']).withMessage('Action must be accept or reject')],
  validate,
  requestController.resolve
);

module.exports = router;

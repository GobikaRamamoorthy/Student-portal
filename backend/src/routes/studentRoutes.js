const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

const router = express.Router();

// All student routes require an authenticated student.
router.use(authenticate, authorize('student'));

router.get('/me', studentController.getProfile);

router.put(
  '/me',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('phone').optional().isString().trim(),
    body('altEmail').optional({ values: 'falsy' }).isEmail().withMessage('Invalid alternate email'),
    body('gender').optional().isString().trim(),
    body('residentType').optional().isIn(['hosteller', 'day-scholar']),
  ],
  validate,
  studentController.updateProfile
);

router.get('/me/academics', studentController.getAcademics);
router.get('/me/report', studentController.getReport);

module.exports = router;

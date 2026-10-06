const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', adminController.stats);
router.get('/students', adminController.searchStudents);
router.get('/students/:id', adminController.studentReport);

module.exports = router;

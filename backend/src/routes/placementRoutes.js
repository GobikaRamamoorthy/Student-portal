const express = require('express');
const { authenticate } = require('../middleware/auth');
const placementController = require('../controllers/placementController');

const router = express.Router();

router.use(authenticate);
router.get('/', placementController.list);
router.get('/:id', placementController.getOne);

module.exports = router;

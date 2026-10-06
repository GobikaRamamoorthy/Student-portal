const express = require('express');

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const requestRoutes = require('./requestRoutes');
const placementRoutes = require('./placementRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/requests', requestRoutes);
router.use('/placements', placementRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

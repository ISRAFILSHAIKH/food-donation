const express = require('express');
const router = express.Router();
const { getAllUsers, getStats, toggleUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/stats', protect, authorize('admin'), getStats);
router.put('/users/:id/toggle', protect, authorize('admin'), toggleUserStatus);

module.exports = router;
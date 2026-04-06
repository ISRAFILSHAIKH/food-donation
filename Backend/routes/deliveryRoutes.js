const express = require('express');
const router = express.Router();
const {
  acceptDelivery,
  updateDeliveryStatus,
  getMyDeliveries,
  getAllDeliveries
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

// Volunteer routes
router.post('/accept/:donationId', protect, authorize('volunteer'), acceptDelivery);
router.put('/:id/status', protect, authorize('volunteer'), updateDeliveryStatus);
router.get('/my', protect, authorize('volunteer'), getMyDeliveries);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllDeliveries);

module.exports = router;
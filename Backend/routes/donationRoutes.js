const express = require('express');
const router = express.Router();
const {
  addDonation,
  getMyDonations,
  getAvailableDonations,
  getAllDonations,
  reviewDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

// Donor routes
router.post('/', protect, authorize('donor'), addDonation);
router.get('/my', protect, authorize('donor'), getMyDonations);

// Volunteer routes
router.get('/available', protect, authorize('volunteer'), getAvailableDonations);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllDonations);
router.put('/:id/review', protect, authorize('admin'), reviewDonation);

module.exports = router;
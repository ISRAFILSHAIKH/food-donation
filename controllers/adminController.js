const User = require('../models/User');
const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: 'pending' });
    const approvedDonations = await Donation.countDocuments({ status: 'approved' });
    const deliveredDonations = await Donation.countDocuments({ status: 'delivered' });
    const totalDeliveries = await Delivery.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalVolunteers,
        totalDonations,
        pendingDonations,
        approvedDonations,
        deliveredDonations,
        totalDeliveries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getStats, toggleUserStatus };
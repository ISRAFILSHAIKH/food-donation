const Donation = require('../models/Donation');

// @desc    Add new food donation
// @route   POST /api/donations
// @access  Private (Donor)
const addDonation = async (req, res) => {
  try {
    const { foodName, quantity, location, expiryTime, description } = req.body;

    if (!foodName || !quantity || !location || !expiryTime) {
      return res.status(400).json({ success: false, message: 'Please provide food name, quantity, location, and expiry time' });
    }

    const donation = await Donation.create({
      foodName,
      quantity,
      location,
      expiryTime,
      description,
      donor: req.user.id
    });

    await donation.populate('donor', 'name email');

    res.status(201).json({
      success: true,
      message: 'Donation added successfully!',
      donation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donations for logged-in donor
// @route   GET /api/donations/my
// @access  Private (Donor)
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('assignedVolunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all approved donations (for volunteers)
// @route   GET /api/donations/available
// @access  Private (Volunteer)
const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'approved' })
      .populate('donor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations/all
// @access  Private (Admin)
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .populate('assignedVolunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject donation (Admin)
// @route   PUT /api/donations/:id/review
// @access  Private (Admin)
const reviewDonation = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('donor', 'name email');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.json({
      success: true,
      message: `Donation ${status} successfully!`,
      donation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addDonation, getMyDonations, getAvailableDonations, getAllDonations, reviewDonation };
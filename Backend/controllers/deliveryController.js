const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');

// @desc    Accept a donation delivery task
// @route   POST /api/deliveries/accept/:donationId
// @access  Private (Volunteer)
const acceptDelivery = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'This donation is not available for pickup' });
    }

    // Check if already accepted by someone
    const existingDelivery = await Delivery.findOne({ donation: req.params.donationId });
    if (existingDelivery) {
      return res.status(400).json({ success: false, message: 'This donation has already been accepted by another volunteer' });
    }

    // Create delivery record
    const delivery = await Delivery.create({
      donation: req.params.donationId,
      volunteer: req.user.id,
      status: 'accepted'
    });

    // Update donation status and assign volunteer
    donation.status = 'accepted';
    donation.assignedVolunteer = req.user.id;
    await donation.save();

    await delivery.populate('donation');
    await delivery.populate('volunteer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Delivery task accepted successfully!',
      delivery
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update delivery status
// @route   PUT /api/deliveries/:id/status
// @access  Private (Volunteer)
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['picked_up', 'delivered'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be picked_up or delivered' });
    }

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    // Ensure this volunteer owns this delivery
    if (delivery.volunteer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this delivery' });
    }

    // Update timestamps
    if (status === 'picked_up') delivery.pickedUpAt = Date.now();
    if (status === 'delivered') delivery.deliveredAt = Date.now();

    delivery.status = status;
    await delivery.save();

    // Sync donation status
    await Donation.findByIdAndUpdate(delivery.donation, { status });

    await delivery.populate('donation');

    res.json({
      success: true,
      message: `Status updated to ${status.replace('_', ' ')}!`,
      delivery
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all deliveries for a volunteer
// @route   GET /api/deliveries/my
// @access  Private (Volunteer)
const getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ volunteer: req.user.id })
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email' }
      })
      .sort({ acceptedAt: -1 });

    res.json({ success: true, count: deliveries.length, deliveries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all deliveries (Admin)
// @route   GET /api/deliveries/all
// @access  Private (Admin)
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate({ path: 'donation', populate: { path: 'donor', select: 'name email' } })
      .populate('volunteer', 'name email')
      .sort({ acceptedAt: -1 });

    res.json({ success: true, count: deliveries.length, deliveries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { acceptDelivery, updateDeliveryStatus, getMyDeliveries, getAllDeliveries };
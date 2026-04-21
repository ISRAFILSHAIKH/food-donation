const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, 'Please provide food name'],
    trim: true,
    maxlength: [100, 'Food name cannot exceed 100 characters']
  },
  quantity: {
    type: String,
    required: [true, 'Please provide quantity'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide pickup location'],
    trim: true
  },
  expiryTime: {
    type: Date,
    required: [true, 'Please provide expiry time']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'accepted', 'picked_up', 'delivered'],
    default: 'pending'
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
DonationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', DonationSchema);
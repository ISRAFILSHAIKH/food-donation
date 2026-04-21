/**
 * Seed Script — Run once to populate sample data
 * Usage: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

// ── Inline models (so we don't need to import from models/) ─────────────────

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: String, isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const DonationSchema = new mongoose.Schema({
  foodName: String, quantity: String, location: String,
  expiryTime: Date, description: String,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }
});
const Donation = mongoose.model('Donation', DonationSchema);

// ── Seed ────────────────────────────────────────────────────────────────────

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Donation.deleteMany({});
  console.log('🗑️  Cleared existing data');

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // Create users
  const users = await User.insertMany([
    { name: 'Admin User',      email: 'admin@foodshare.com',    password: hash('admin123'),   role: 'admin'     },
    { name: 'Priya Sharma',    email: 'donor@test.com',         password: hash('donor123'),   role: 'donor'     },
    { name: 'Rohan Patel',     email: 'donor2@test.com',        password: hash('donor123'),   role: 'donor'     },
    { name: 'Arjun Singh',     email: 'volunteer@test.com',     password: hash('vol123'),     role: 'volunteer' },
    { name: 'Meera Nair',      email: 'volunteer2@test.com',    password: hash('vol123'),     role: 'volunteer' },
  ]);

  const admin   = users.find(u => u.role === 'admin');
  const donor1  = users.find(u => u.email === 'donor@test.com');
  const donor2  = users.find(u => u.email === 'donor2@test.com');

  console.log('👥 Created users');

  // Create donations
  const now = Date.now();
  await Donation.insertMany([
    {
      foodName: 'Vegetable Biryani',
      quantity: '25 plates',
      location: '12 MG Road, Pune',
      expiryTime: new Date(now + 6 * 3600 * 1000),
      description: 'Freshly cooked, suitable for all ages',
      donor: donor1._id,
      status: 'pending'
    },
    {
      foodName: 'Samosas & Chutney',
      quantity: '50 pieces',
      location: '45 FC Road, Shivajinagar, Pune',
      expiryTime: new Date(now + 4 * 3600 * 1000),
      description: 'Freshly fried, best served hot',
      donor: donor1._id,
      status: 'approved'
    },
    {
      foodName: 'Dal Rice & Sabzi',
      quantity: '30 portions',
      location: '7 Karve Road, Kothrud, Pune',
      expiryTime: new Date(now + 8 * 3600 * 1000),
      description: 'Home cooked complete meal',
      donor: donor2._id,
      status: 'approved'
    },
    {
      foodName: 'Pav Bhaji',
      quantity: '20 plates',
      location: '3 JM Road, Deccan, Pune',
      expiryTime: new Date(now + 5 * 3600 * 1000),
      donor: donor2._id,
      status: 'delivered'
    },
    {
      foodName: 'Idli Sambar',
      quantity: '40 plates',
      location: '88 Baner Road, Pune',
      expiryTime: new Date(now + 3 * 3600 * 1000),
      donor: donor1._id,
      status: 'rejected'
    },
  ]);

  console.log('📦 Created sample donations');
  console.log('\n🎉 Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 TEST CREDENTIALS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:      admin@foodshare.com  / admin123');
  console.log('Donor:      donor@test.com       / donor123');
  console.log('Donor 2:    donor2@test.com      / donor123');
  console.log('Volunteer:  volunteer@test.com   / vol123');
  console.log('Volunteer 2:volunteer2@test.com  / vol123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
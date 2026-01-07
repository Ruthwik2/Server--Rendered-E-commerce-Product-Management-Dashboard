require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

async function setupAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Delete existing admin@dummy.com and recreate
    await User.deleteOne({ email: 'admin@dummy.com' });
    console.log('Deleted existing admin@dummy.com');

    // Create new dummy admin with properly hashed password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      email: 'admin@dummy.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Created new admin: admin@dummy.com with password: admin123');

    // List all admins
    const admins = await User.find({}).select('-password');
    console.log('\nCurrent admins:');
    admins.forEach(a => console.log(`  - ${a.email} (${a.role})`));

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();

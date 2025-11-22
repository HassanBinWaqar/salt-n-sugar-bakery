// Reset admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/saltnsugar';

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin
    await Admin.deleteMany({});
    console.log('Deleted existing admin users');

    // Create new admin user
    const hashedPassword = await bcrypt.hash('YourNewPassword123', 10);
    
    const admin = await Admin.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@saltnsugar.com'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: YourNewPassword123');
    console.log('⚠️  IMPORTANT: Change this password immediately after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
}

resetAdmin();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cuisine: { type: String, required: true },
  image: { type: String, required: true },
  isLateNight: { type: Boolean, default: false },
  location: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  phone: { type: String, required: true },
});

// Pre-save middleware to hash password
restaurantSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt with cost factor 10
    const salt = await bcrypt.genSalt(10);
    // Hash password with new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
restaurantSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
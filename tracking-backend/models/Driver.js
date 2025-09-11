const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  busId: {
    type: String,
    ref: 'Bus',
    default: null
  }
}, {
  timestamps: true
});


driverSchema.static.hashPassword=async function(password) {
      const hashedPassword=await bcrypt.hash(password,10);
      return hashedPassword;
};


driverSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('Driver', driverSchema);
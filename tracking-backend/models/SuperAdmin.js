const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const superAdminSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: "superadmin"
  }
}, { timestamps: true });

superAdminSchema.statics.hashPassword = async function(password) {
  
    const response= await bcrypt.hash(password, 10);
    console.log("hashed password:",response);
    return response;

};

superAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("SuperAdmin", superAdminSchema);

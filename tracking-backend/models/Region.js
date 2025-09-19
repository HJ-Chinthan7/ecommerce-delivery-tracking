const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  superadminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuperAdmin",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Region", regionSchema);

const mongoose = require('mongoose');

const busStopSchema = new mongoose.Schema({
  stopId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  busStops: [busStopSchema],
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);

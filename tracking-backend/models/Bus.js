const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true
  },
  driverId: {
    type: String,
    required: true
  },
  routeId: {
    type: String,
    required: true
  },
  parcels: [{
    type: String,
    ref: 'Parcel'
  }],
  currentLocation: {
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  currentBusStop: {
    stopId: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  nextBusStop: {
    stopId: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);
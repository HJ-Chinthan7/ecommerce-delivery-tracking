const mongoose = require('mongoose');
const busSchema = new mongoose.Schema({
  busId: {
     type: String,
      required: true,
       unique: true 
      },
  driverId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Driver",
     default: null 
    },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    default: null 
  },
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  parcels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel"
  }],
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
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
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);

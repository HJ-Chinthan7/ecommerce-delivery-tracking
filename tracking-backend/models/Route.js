const mongoose = require('mongoose');


const busStopSchema = new mongoose.Schema({
  stopId: {
    type: String,
     default: async () => {
      const { v4: uuidv4 } = await import('uuid');
      return uuidv4();
     }
  },
  name: {
    type: String,
    required: true,
  },
 
  timings: {
    type: [String], 
    default: [],
  },
  order: {
    type: Number,
    required: true,
  },
});


const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  maxshifts: {
    type: Number,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  busStops: [busStopSchema],
  startTimes: {
    type: [String], 
    default: [],
  },
  endTimes: {
    type: [String], 
    default: [],
  },
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Route', routeSchema);

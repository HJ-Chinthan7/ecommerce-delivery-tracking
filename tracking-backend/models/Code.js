const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: "Parcel", default: null },
  parcelIds: { type: [mongoose.Schema.Types.ObjectId], default: [] }, 
  busId: { type: String, default: null },
  type: { type: String, required: true }, 
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Code", codeSchema);

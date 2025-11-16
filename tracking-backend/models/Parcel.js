const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

   
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        name: String,
        qty: Number,
        price: Number,
        image: String,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true }, 
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },

    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assigner",
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assigner",
      default: null,
    },

    assignedAt: { type: Date, default: null },

  
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "in_transit",
        "delivered",
        "unassigned",
        "returned",
      ],
      default: "pending",
    },

   
    isDispatched: { type: Boolean, default: false },
    isAddressChanged: { type: Boolean, default: false },

  
    deliveredAt: { type: Date, default: null },
    expectedDelivery: { type: Date, default: null },


    history: [
      {
        action: String,
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assigner",
        },
        at: { type: Date, default: Date.now },
        meta: Object,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parcel", parcelSchema);

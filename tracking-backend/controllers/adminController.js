const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Admin = require("../models/Admin");
const Driver = require("../models/Driver")
const Bus = require('../models/Bus');
const generateAdminToken = require('../utils/generateAToken');
const Parcel = require("../models/Parcel");
module.exports.AdminLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }

        let user = null;
        let userType = null;

        if (role === 'admin') {
            user = await Admin.findOne({ email }).populate('regionId');
            userType = 'admin';
        }
        else {
            return res.status(400).json({ error: 'Insufficient Permission' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateAdminToken({
            _id: user._id,
            email: user.email,
            regionId: user.regionId._id
        });
        res.cookie('token', token, {
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({
            success: true,
            token,
            admin: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: userType,
                region: user.regionId.name
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.registerDriver = async (req, res) => {
    try {
        const { driverId, name, email, password } = req.body;

        const adminId = req.user._id;
        const regionId = req.user.regionId._id || req.user.regionId;

        if (!driverId || !name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingDriver = await Driver.findOne({
            $or: [{ driverId }, { email }],
        });
        if (existingDriver) {
            return res.status(400).json({ error: "Driver with this ID or email already exists" });
        }


        const passwordHash = await Driver.hashPassword(password);

        const driver = new Driver({
            driverId,
            name,
            email,
            password: passwordHash,
            regionId,
            adminId,
        });

        await driver.save();
        res.json({
            success: true,
            message: "Driver registered successfully. Waiting for superadmin approval.",
            driver: {
                id: driver._id,
                driverId: driver.driverId,
                name: driver.name,
                email: driver.email,
                status: driver.status,
            },
        });
    } catch (error) {
        console.error("Register driver error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports.getRegionDrivers = async (req, res) => {
    try {
        const regionId = req.user.regionId._id;

        const drivers = await Driver.find({ regionId })
            .populate("regionId", "name")
            .populate("adminId", "name email");
        res.json({
            success: true,
            drivers,
        });
    } catch (error) {
        console.error("Get region drivers error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.getRegionBuses = async (req, res) => {
    try {
        const regionId = req.user.regionId;

        const buses = await Bus.find({ regionId })
            .populate("regionId", "name").populate("driverId", "name email _id").populate("routeId", "name _id description routeId");

        res.json({
            success: true,
            buses,
        });
    } catch (error) {
        console.error("Get region buses error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports.getRegionParcels=async (req, res) => {
  try {
    const regionId = req.user.regionId;

   const parcels = await Parcel.find({ region:regionId });
console.log(parcels)
    res.json({
      success: true,
     parcels,
    });

  } catch (error) {
    console.error("Get region parcels error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 

module.exports.assignBus = async (req, res) => {
    try {
        const { driverId, busId } = req.body;
        const regionId = req.user.regionId._id;

        if (!driverId || !busId) {
            return res
                .status(400)
                .json({ error: "Driver ID and Bus ID are required" });
        }



        const driver = await Driver.findOne({
            _id: new mongoose.Types.ObjectId(driverId),
            regionId:new mongoose.Types.ObjectId(regionId),
            status: 'approved'
        });

        if (!driver) {
            return res.status(404).json({ error: "Driver not found or not approved in your region" });
        }
        const bus = await Bus.findOne({ _id:new mongoose.Types.ObjectId(busId), regionId:new mongoose.Types.ObjectId(regionId) });
        if (!bus) {
            return res.status(404).json({ error: "Bus not found in your region" });
        }

        driver.busId = busId;
        await driver.save();

        bus.driverId = driverId;
        bus.isActive = true;
        await bus.save();

        res.json({
            success: true,
            message: "Bus assigned to driver successfully",
            assignment: {
                driverId: driver.driverId,
                driverName: driver.name,
                busId: bus.busId,
            },
        });
    } catch (error) {
        console.error("Assign bus error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.AdminLogout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};


module.exports.assignBusToParcels = async (req, res) => {
  try {
    const { parcelIds, busId } = req.body;
    if (!parcelIds || !busId) return res.status(400).json({ message: "parcelIds and busId are required" });

    const updatedParcels = await Parcel.updateMany(
      { _id: { $in: parcelIds } },
      { busId, status: "assigned" },
      { new: true }
    );

    await Bus.findByIdAndUpdate(
      busId,
      { $addToSet: { parcels: { $each: parcelIds } } }
    );

    res.json({ success: true, message: "Parcels assigned to bus successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.unassignParcelsFromBus = async (req, res) => {
  try {
    const { parcelIds } = req.body;
    if (!parcelIds) return res.status(400).json({ message: "parcelIds are required" });

    const parcelsToUnassign = await Parcel.find({
      _id: { $in: parcelIds },
      status: { $nin: ["in_transit", "delivered"] }
    });

    const parcelIdsToUpdate = parcelsToUnassign.map(p => p._id);

    await Parcel.updateMany(
      { _id: { $in: parcelIdsToUpdate } },
      { busId: null, status: "unassigned" }
    );

    await Bus.updateMany(
      { parcels: { $in: parcelIdsToUpdate } },
      { $pull: { parcels: { $in: parcelIdsToUpdate } } }
    );

    res.json({ success: true, message: "Parcels unassigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.removeParcelsRegion = async (req, res) => {
  try {
    const { parcelIds } = req.body;
    if (!parcelIds) return res.status(400).json({ message: "parcelIds are required" });

    await Parcel.updateMany(
      { _id: { $in: parcelIds } },
      { $unset: { region: "" }, status: "pending" }
    );

    res.json({ success: true, message: "Region removed from selected parcels" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getUnassignedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ status: { $in: ["pending", "unassigned"] } });
    res.json(parcels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getAssignedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ status: "assigned" });
    res.json(parcels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getAddressChangedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ isAddressChanged: true });
    res.json(parcels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
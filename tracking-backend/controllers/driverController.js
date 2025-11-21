const Driver = require("../models/Driver");
const Bus = require("../models/Bus");
const Parcel = require("../models/Parcel") //eslint-disable-line
const generateToken = require("../utils/generateToken")
const { validationResult } = require('express-validator');
const axios = require("axios");
const transporter = require('../utils/mailSender')
const Code = require("../models/Code");
const Route = require("../models/Route")

module.exports.driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await driver.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const bus = await Bus.findOne({ _id: driver.busId });
    console.log(bus);
    const driverData = {
      driverId: driver.driverId,
      email: driver.email
    }
    const token = generateToken(driverData);

    res.cookie('token', token,
      {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    res.json({
      success: true,
      token,
      driver: {
        driverId: driver.driverId,
        name: driver.name,
        email: driver.email,
        bus: bus ? bus : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.driverRegister = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { driverId, name, email, password, busId, adminId, regionId, status } = req.body;

    if (!driverId || !name || !email || !password || !adminId || !regionId) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const existingDriver = await Driver.findOne({ $or: [{ email }, { driverId }] });
    if (existingDriver) {
      return res.status(400).json({ error: "Driver already exists" });
    }


    const hashedPassword = await Driver.hashPassword(password);


    const driver = new Driver({
      driverId,
      name,
      email,
      status,
      password: hashedPassword,
      adminId,
      regionId,
      busId: busId || null
    });

    await driver.save();

    let globalbus = null;
    if (busId) {
      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ error: 'Bus not found' });
      }

      if (bus.driverId) {
        return res.status(400).json({ error: 'Bus is already assigned to another driver' });
      }

      bus.driverId = driver._id;
      await bus.save();
      globalbus = bus;
    }

    const driverData = { driverId: driver.driverId, email: driver.email, _id: driver._id };
    const token = generateToken(driverData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: "Driver registered successfully",
      driver: {
        driverId: driver.driverId,
        name: driver.name,
        email: driver.email,
        status: driver.status,
        busId: globalbus?.busId || null,
        routeId: globalbus?.routeId || null,
        busStatus: globalbus?.status || null
      },
    });
  } catch (err) {
    console.error("Driver registration error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
};


module.exports.driverLogout = async (req, res) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(400).json({ success: false, message: 'No token found' });
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports.getBusRouteDetails = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId)
      .populate({
        path: "regionId",
        select: "name code",
      })
      .populate({
        path: "adminId",
        select: "name email",
      })
      .populate({
        path: "routeId",
        select:
          "routeId name description maxshifts startTimes endTimes busStops regionId isActive createdAt updatedAt",
      })
      .populate({
        path: "driverId",
        select: "name email status",
      });
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    if (!bus.routeId) return res.status(404).json({ message: "Route not assigned" });

    const route = bus.routeId;

    const data = {
      bus: {
        _id: bus._id,
        busId: bus.busId,
        region: bus.regionId ? bus.regionId.name : null,
        regionCode: bus.regionId ? bus.regionId.code : null,
        admin: bus.adminId ? { name: bus.adminId.name, email: bus.adminId.email } : null,
        driver: bus.driverId
          ? { name: bus.driverId.name, email: bus.driverId.email, status: bus.driverId.status }
          : null,
        currentBusStop: bus.currentBusStop,
        nextBusStop: bus.nextBusStop,
        RouteOrderNo: bus.RouteOrderNo,
        RouteName: route.name,
        routeId: route._id,
        isActive: bus.isActive,
        status: bus.status,
        direction: bus.direction
      },
      route: {
        routeId: route._id,
        name: route.name,
        description: route.description,
        regionId: route.regionId,
        maxshifts: route.maxshifts,
        startTimes: route.startTimes,
        endTimes: route.endTimes,
        isActive: route.isActive,
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
        busStops: route.busStops.map((stop) => ({
          stopId: stop.stopId,
          name: stop.name,
          order: stop.order,
          timings: stop.timings,
        })),
      },
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getRouteInfo:", error);
    return res.status(500).json({ message: "Server error fetching route info" });
  }
};

module.exports.updateBusStop = async (req, res) => {
  try {
    const { busId } = req.params;
    const { stopId } = req.body;

    const bus = await Bus.findById(busId).populate({
      path: "routeId",
      select:
        "routeId name description maxshifts startTimes endTimes busStops regionId isActive createdAt updatedAt",
    });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const route = bus.routeId;
    if (!route) return res.status(404).json({ message: "Route not assigned" });

    let stops = [...route.busStops];
    if (bus.direction === "return") {
      stops = stops.sort((a, b) => b.order - a.order);
    } else {
      stops = stops.sort((a, b) => a.order - b.order);
    }

    const currentIndex = stops.findIndex((s) => s.stopId === stopId);
    if (currentIndex === -1)
      return res.status(400).json({ message: "Stop not found in route" });

    const currentBusStop = stops[currentIndex];
    let nextBusStop = null;
    let updatedDirection = bus.direction;

    if (currentIndex < stops.length - 1) {
      nextBusStop = stops[currentIndex + 1];
    } else {
      updatedDirection = bus.direction === "forward" ? "return" : "forward";
      const newStops =
        updatedDirection === "forward"
          ? route.busStops.sort((a, b) => a.order - b.order)
          : route.busStops.sort((a, b) => b.order - a.order);

      nextBusStop =
        updatedDirection === "forward" ? newStops[1] : newStops[newStops.length - 2];
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      busId,
      {
        currentBusStop,
        nextBusStop,
        direction: updatedDirection,
        RouteOrderNo: currentBusStop.order,
      },
      { new: true }
    );


    const data = {
      bus: {
        _id: updatedBus._id,
        busId: updatedBus.busId,
        region: updatedBus.regionId ? updatedBus.regionId.name : null,
        regionCode: updatedBus.regionId ? updatedBus.regionId.code : null,
        admin: updatedBus.adminId
          ? { name: updatedBus.adminId.name, email: updatedBus.adminId.email }
          : null,
        driver: updatedBus.driverId
          ? {
            name: updatedBus.driverId.name,
            email: updatedBus.driverId.email,
            status: updatedBus.driverId.status,
          }
          : null,
        currentBusStop: updatedBus.currentBusStop,
        nextBusStop: updatedBus.nextBusStop,
        RouteOrderNo: updatedBus.RouteOrderNo,
        RouteName: route.name,
        routeId: route._id,
        isActive: updatedBus.isActive,
        status: updatedBus.status,
        direction: updatedBus.direction,
      },
      route: {
        routeId: route._id,
        name: route.name,
        description: route.description,
        regionId: route.regionId,
        maxshifts: route.maxshifts,
        startTimes: route.startTimes,
        endTimes: route.endTimes,
        isActive: route.isActive,
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
        busStops: route.busStops.map((stop) => ({
          stopId: stop.stopId,
          name: stop.name,
          order: stop.order,
          timings: stop.timings,
        })),
      },
    };

    return res.status(200).json({
      message: "Bus stop updated",
      ...data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports.sendNotification = async (req, res) => {
  try {
    const { busId } = req.params;

    if (!busId) {
      return res.status(400).json({ message: "busId is required" });
    }

    const parcels = await Parcel.find({ busId });
    if (!parcels.length) {
      return res
        .status(404)
        .json({ message: "No parcels found for this bus" });
    }

    const userIds = [...new Set(parcels.map((p) => p.user.toString()))];
    //  http://localhost:5000/
    const { data } = await axios.post(
      "https://ecomm-doit.onrender.com/api/users/batch",
      { userIds }
    );

    const users = data?.data;

    if (!users || !users.length) {
      return res
        .status(404)
        .json({ message: "No users found for these parcels" });
    }

    const trackingLink = `https://real-time-trackingofbuses.netlify.app/track/${busId}`;

    await Promise.all(
      users.map(async (user) => {
        const mailOptions = {
          from: process.env.FROM_EMAIL,
          to: user.email,
          subject: "Your parcel is on the way!",
          text: `Hi ${user.username},\n\nYour parcel's bus is approaching.\nTrack the bus here:\n${trackingLink}\n\nThank you!`,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
        } catch (err) {
          console.error(`Failed to send mail to ${user.email}:`, err.message);
        }
      })
    );

    await Parcel.updateMany(
      { busId },
      { $set: { isDispatched: true } }
    );

    return res.json({
      success: true,
      message: `Notifications sent to ${users.length} users, parcels updated.`,
      trackingLink,
    });
  } catch (err) {
    console.error("Error in sendNotification:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.getBusParcels = async (req, res) => {
  try {
    const { busId } = req.params;
    const parcels = await Parcel.find({
      busId,
      status: { $ne: "delivered" },
      deliveredAt: null,
    });
    res.json({ success: true, parcels });
  } catch (err) {
    console.error("getBusParcels err", err);
    res.status(500).json({ success: false });
  }
};

module.exports.getUsersBatch = async (req, res) => {
  try {
    const { userIds } = req.body;
    // http://localhost:5000/
    const users = await axios.post("https://ecomm-doit.onrender.com/api/users/getParcelUsers", { userIds });
    res.json({ success: true, data: users.data });
  } catch (err) {
    console.error("getUsersBatch err", err);
    res.status(500).json({ success: false });
  }
};


module.exports.generateCode = async (req, res) => {
  try {
    const { parcelId, parcelIds, busId, type } = req.body;
    if (!type) return res.status(400).json({ success: false, msg: "type required" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const payload = {
      parcelId: parcelId || null,
      parcelIds: parcelIds || [],
      busId: busId || null,
      type,
      code,
      createdAt: new Date(),
    };

    const saved = await Code.create(payload);
    if (type === "delivery" && parcelId) {
      const parcel = await Parcel.findById(parcelId);
      if (!parcel) {
        return res.status(404).json({ success: false, msg: "Parcel not found" });
      }
      const userId = parcel.user;
      const usersRes = await axios.post(
        process.env.USER_SERVICE_URL + "/getParcelUsers",
        { userIds: [userId] }
      );
      const userData = usersRes?.data?.[0];
      const to = userData?.email || process.env.ADMIN_EMAIL;
      const subject = "Delivery OTP";
      const text = `Your delivery OTP: ${code}`;
      
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        text,
      });
    }
    else if (type === "remove_selected") {
      const parcel = await Parcel.findById(parcelIds[0]);
      const bus = await Bus.findById(parcel?.busId).populate("adminId", "email name");
      const to = bus?.adminId?.email;
      const subject = type === "remove" ? "Parcel Remove OTP" : type === "remove_all" ? "Remove All OTP" : "Remove Selected OTP";
      const text = `OTP for action (${type}): ${code}`;
      await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, text });
    }
    else {
      const bus = await Bus.findById(busId).populate("adminId", "email name");
      const to = bus?.adminId?.email;
      const subject = type === "remove" ? "Parcel Remove OTP" : type === "remove_all" ? "Remove All OTP" : "Remove Selected OTP";
      const text = `OTP for action (${type}): ${code}`;
      await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, text });
    }
    res.json({ success: true, codeId: saved._id });
  } catch (err) {
    console.error("generateCode err", err);
    res.status(500).json({ success: false });
  }
};




module.exports.verifyCode = async (req, res) => {
  try {
    const { codeId, code } = req.body;
    const record = await Code.findById(codeId);
    if (!record) return res.json({ success: false, msg: "Invalid codeId" });
    if (record.code !== code) return res.json({ success: false, msg: "Wrong code" });

    if (Date.now() - new Date(record.createdAt).getTime() > 5 * 60 * 1000) {
      return res.json({ success: false, msg: "Code expired" });
    }

    res.json({ success: true, record });
  } catch (err) {
    console.error("verifyCode err", err);
    res.status(500).json({ success: false });
  }
};


module.exports.markDelivered = async (req, res) => {
  try {
    const { email } = req.body;
    const { parcelId } = req.params;
    const parcel = await Parcel.findById(parcelId);

    if (!parcel) {
      return res.status(404).json({ success: false, msg: "Parcel not found" });
    }

    const item = parcel.items?.[0];
    const productName = item?.name || "Product";
    const productPrice = item?.price || 0;
    const addr = parcel.shippingAddress;
    const shippingText = `Address:
${addr.address}, 
${addr.city}, ${addr.district}, 
${addr.state}, ${addr.postalCode}, 
${addr.country}
`;

    await Parcel.findByIdAndUpdate(parcelId, {
      status: "delivered",
      deliveredAt: new Date(),
    });

    const to = email;
    const subject = "Product Delivered Successfully";
    const text = `
Your product has been delivered! 

Product: ${productName}
Price: ₹${productPrice}

Delivery Details:
${shippingText}

Thank you for ordering with us.
    `;

if (!parcel.orderId) {
  console.error("orderId missing for parcel:", parcel._id);
} else {
  await axios.put(
    "https://ecomm-doit.onrender.com/api/orders/markorder",
    { orderId: parcel.orderId }
  );
    await transporter.sendMail({
  from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("markDelivered err", err);
    res.status(500).json({ success: false });
  }
};

module.exports.removeParcel = async (req, res) => {
  try {
    const { parcelId } = req.params;
    // optionally checking isAddressChanged logic here if needed is not done yet
    await Parcel.findByIdAndUpdate(parcelId, { busId: null, status: "unassigned" });
    res.json({ success: true });
  } catch (err) {
    console.error("removeParcel err", err);
    res.status(500).json({ success: false });
  }
};

module.exports.removeAllParcels = async (req, res) => {
  try {
    const { busId } = req.params;
    await Parcel.updateMany(
      {
        busId,
        status: { $ne: "delivered" },
        deliveredAt: null
      },
      {
        $set: {
          busId: null,
          status: "unassigned",
          isDispatched: false
        }
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("removeAllParcels err", err);
    res.status(500).json({ success: false });
  }
};
module.exports.removeSelectedParcels = async (req, res) => {
  try {
    const { parcelIds } = req.body;
    if (!Array.isArray(parcelIds) || parcelIds.length === 0) return res.json({ success: false, msg: "No parcelIds provided" });
    await Parcel.updateMany({ _id: { $in: parcelIds } }, { $set: { busId: null, status: "unassigned", isDispatched: false } });
    res.json({ success: true });
  } catch (err) {
    console.error("removeSelectedParcels err", err);
    res.status(500).json({ success: false });
  }
};

module.exports.notificationSelected = async (req, res) => {
  try {
    const { busId } = req.params;

    const parcels = await Parcel.find({ busId });

    if (!parcels.length) {
      return res.json({
        success: true,
        message: "No parcels found for this bus"
      });
    }
    const userIds = parcels.map(p => p.user);

    const usersRes = await axios.post(
      "https://ecomm-doit.onrender.com/api/users/getParcelUsers", { userIds }
    );
    const users = usersRes.data || [];
    const emails = users.map(u => u.email).filter(Boolean);
    if (!emails.length) {
      return res.status(400).json({
        success: false,
        message: "No valid emails found for these users"
      });
    }

    const trackingLink = `https://real-time-trackingofbuses.netlify.app/track/${busId}`;

    for (const email of emails) {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Bus Arrival Notification ",
        text: `Your parcel is arriving soon.   tracking Link = ${trackingLink} `,
      });
    }

    res.json({
      success: true,
      notified: emails.length,
      message: "Notifications sent to all users on this bus!"
    });

  } catch (err) {
    console.error("notification err:", err.message);
    res.status(500).json({
      success: false,
      error: "Notification failed"
    });
  }
};

module.exports.notifyWholeBus = async (req, res) => {
  try {
    const { busId } = req.params;

    const parcels = await Parcel.find({ busId });

    if (!parcels.length) {
      return res.json({
        success: true,
        message: "No parcels found for this bus"
      });
    }

    const userIds = parcels.map(p => p.user);
    const usersRes = await axios.post(
      "https://ecomm-doit.onrender.com/api/users/getParcelUsers", { userIds }
    );

    const users = usersRes.data.users || [];
    const emails = users.map(u => u.email).filter(Boolean);

    if (!emails.length) {
      return res.status(400).json({
        success: false,
        message: "No email IDs found for users on this bus"
      });
    }

    const trackingLink = `https://real-time-trackingofbuses.netlify.app/track/${busId}`;

    for (const email of emails) {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Bus Arrival",
        text: `Your parcel is arriving soon.   tracking Link = ${trackingLink} `,
      });
    }

    res.json({
      success: true,
      notified: emails.length,
      message: "Notifications sent to all users"
    });

  } catch (err) {
    console.error("notifyWholeBus error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to send notifications"
    });
  }
};
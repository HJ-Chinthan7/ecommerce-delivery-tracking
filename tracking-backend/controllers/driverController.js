const Driver = require("../models/Driver");
const Bus=require("../models/Bus");
const generateToken=require("../utils/generateToken")
const transporter = require("../utils/mailSender");
const { validationResult } = require('express-validator');
module.exports.driverLogin=async(req,res)=>{
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
const driverData={ 
  driverId: driver.driverId,
  email: driver.email
}
    const token = generateToken(driverData);
  
res.cookie('token',token,   
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

    const { driverId, name, email, password, busId, adminId, regionId,status } = req.body;

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

    let globalbus=null;
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
      globalbus=bus;
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
      driver:{
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


module.exports.getBusRouteDetails=async (req, res) => {
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
        path: "driverId",
        select: "name email status", 
      })
      .populate({
        path: "routeId",
        select:
          "routeId name description maxshifts startTimes endTimes busStops regionId isActive createdAt updatedAt",
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
        direction:bus.direction
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
    // .populate("parcels");

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

    // Notify parcels in next 2 stops
    /*
    const nextTwoStops = stops.slice(currentIndex + 1, currentIndex + 3).map((s) => s.stopId);

    const parcelsToNotify = await Parcel.find({
      busId: bus._id,
      stopId: { $in: nextTwoStops },
      attemptDelivery: true,
    });

    for (const parcel of parcelsToNotify) {
      // Send email with tracking link
      const mailOptions = {
        from: "no-reply@tracking.com",
        to: parcel.userEmail,
        subject: "Your parcel is on the way!",
        text: `Hi, your parcel is approaching. Track it here: ${parcel.trackingLink}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("Mail error:", err);
        else console.log("Mail sent:", info.response);
      });
    }
    */

    // Construct response in the format you want
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

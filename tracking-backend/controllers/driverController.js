const Driver = require("../models/Driver");
const Bus=require("../models/Bus");
const generateToken=require("../utils/generateToken")
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
    console.log("Bus found:", bus);
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
        busId: bus ? bus.busId : null
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
    console.log("Validation errors:", errors.array());
    console.log("Request body:", req.body);
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

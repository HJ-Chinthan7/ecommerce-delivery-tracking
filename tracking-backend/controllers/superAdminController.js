

const Region = require("../models/Region");
const { validationResult } =require('express-validator');
const jwt = require('jsonwebtoken');
const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");
const Bus = require('../models/Bus');

module.exports.superAdminLogin =  async (req, res) => {
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

    if (role === 'superadmin') {
      user = await SuperAdmin.findOne({ email });
      userType = 'superadmin';
      console.log("superadmin user:",user);
    }
    else  {
      return res.status(400).json({ error: 'Insufficient Permission' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: userType
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
res.cookie('token',token,{
    secure:true,
    httpOnly:true,
    maxAge:24*60*60*1000
});
    res.json({
      success: true,
      token,
      admin: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: userType
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports.createRegion = async (req, res) => {
  try {
    const { name, code, superadminId } = req.body;

    const existingRegion = await Region.findOne({ $or: [{ name }, { code }] });
    if (existingRegion) {
      return res.status(400).json({ success: false, error: "Region name or code already exists" });
    }

    const newRegion = new Region({
      name,
      code,
      superadminId
    });

    await newRegion.save();

    return res.status(201).json({ success: true, region: newRegion });
  } catch (error) {
    console.error("Error creating region:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, regionId } = req.body;


    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const hashedPassword = await Admin.hashPassword(password);

    
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      regionId
    });

    await newAdmin.save();

    return res.status(201).json({ success: true, admin: newAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


module.exports.createBus = async (req, res) => {
  try {
    //const errors = validationResult(req);//later implement validation
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { busId, regionId, adminId,routeId } = req.body;

    if (!busId ||  !regionId || !adminId) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const existingBus = await Bus.findOne({ busId });
    if (existingBus) {
      return res.status(400).json({ error: 'Bus already exists' });
    }

    const bus = new Bus({
      busId,
      routeId,
      regionId,
      adminId,
      driverId: null, 
      parcels: [],
      currentLocation: { lat: 0, lng: 0 },
      isActive: true,
      status: 'approved', 
      currentBusStop: { stopId: null, name: null },
      nextBusStop: { stopId: null, name: null }
    });

    await bus.save();

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      bus
    });

  } catch (err) {
    console.error('Bus creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

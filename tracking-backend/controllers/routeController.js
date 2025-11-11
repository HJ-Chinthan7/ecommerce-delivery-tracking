const { validationResult } = require('express-validator');
const Route = require('../models/Route');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");


module.exports.createRoute = async (req, res) => {
  try {
    const { name, description, stops } = req.body;

   
    if (!name || !stops || !Array.isArray(stops) || stops.length === 0) {
      return res.status(400).json({ error: "Route name and stops are required" });
    }
const busStops = stops.map((stop, index) => ({
  stopId: uuidv4(),
  name: stop.stopName || stop.name,
  address: stop.address || "",
  order: index + 1,
}));

const route = new Route({
  routeId: uuidv4(),
  name,
  description: description || "",
  busStops,
  regionId: req.user.regionId, 
  isActive: true,
});
    await route.save();

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      route,
    });
  } catch (err) {
    console.error("Create route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.getAllRoutes = async (req, res) => {};
module.exports.getRouteById = async (req, res) => {};
module.exports.updateRoute = async (req, res) => {};
module.exports.deleteRoute = async (req, res) => {};
module.exports.toggleRouteStatus = async (req, res) => {};

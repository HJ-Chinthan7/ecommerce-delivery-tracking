const { validationResult } = require('express-validator');
const Route = require('../models/Route');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");

module.exports.createRoute = async (req, res) => {
  try {
    const { name, description, stops, startTimes, endTimes, maxShifts } = req.body;
    const regionId = req.user.regionId._id; 

    if (!name || !stops || stops.length === 0 || !startTimes || startTimes.length === 0) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const busStops = stops.map((stop, index) => ({
      stopId: uuidv4(),
      name: stop.stopName,
      order: index + 1,
      timings: stop.timings || startTimes, 
    }));

    const route = new Route({
      routeId: uuidv4(),
      name,
      description: description || "",
      busStops,
      startTimes,
      endTimes,
      maxShifts: maxShifts || 1,
      regionId,
      isActive: true,
    });

    await route.save();
    res.status(201).json({ success: true, route });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports.getRegionRoutes = async (req, res) => {
  try {
    const regionId = req.user.regionId._id; 
    const routes = await Route.find({ regionId })
      .sort({ createdAt: -1 })
      .lean(); 

    res.status(200).json({ success: true, routes });
  } catch (err) {
    console.error("Error fetching region routes:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports.getRouteById = async (req, res) => {};
module.exports.updateRoute = async (req, res) => {};
module.exports.deleteRoute = async (req, res) => {};
module.exports.toggleRouteStatus = async (req, res) => {};

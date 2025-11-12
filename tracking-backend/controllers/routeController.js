const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Route = require('../models/Route');
const Bus = require('../models/Bus');


module.exports.createRoute = async (req, res) => {
  try {
    const { v4: uuidv4 } = await import("uuid");
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

module.exports.deleteRoute = async (req, res) => {
   try {
    const { routeId } = req.params;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    await Route.findByIdAndDelete(routeId);

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (err) {
    console.error("Error deleting route:", err);
    res.status(500).json({ message: "Server error while deleting route" });
  }
};


module.exports.toggleRouteStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.isActive = !route.isActive;
    await route.save();

    return res.status(200).json({
      message: `Route ${route.isActive ? "activated" : "deactivated"} successfully`,
      route,
    });
  } catch (error) {
    console.error("Error toggling route status:", error);
    return res.status(500).json({ message: "Server error while toggling route status" });
  }
};

module.exports.unAssignBusRoute = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.routeId = null;
    await bus.save();

    res.status(200).json({
      success: true,
      message: `Route removed from Bus '${bus.busId}' and set inactive.`,
      bus,
    });
  } catch (error) {
    console.error("Error unassigning bus:", error);
    res.status(500).json({ message: "Server error while unassigning route" });
  }
};


module.exports.assignBusRoute = async (req, res) => {
  try {
    const { busId, routeId } = req.body;
    const adminId = req.user?._id; 

    if (!busId || !routeId) {
      return res.status(400).json({ message: "Both Bus ID and Route ID are required" });
    }

    const bus = await Bus.findById(busId);
    const route = await Route.findById(routeId);

    if (!bus) return res.status(404).json({ message: "Bus not found" });
    if (!route) return res.status(404).json({ message: "Route not found" });

   
    if (String(bus.regionId) !== String(route.regionId)) {
      return res.status(403).json({ message: "Bus and Route must belong to the same region" });
    }


    bus.routeId = route._id;
    await bus.save();
    
    res.status(200).json({
      success: true,
      message: `Route '${route.name}' assigned to Bus '${bus.busId}' successfully.`,
      bus,
    });
  } catch (error) {
    console.error("Error assigning bus:", error);
    res.status(500).json({ message: "Server error while assigning route" });
  }
};

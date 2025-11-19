const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const driverController=require("../controllers/driverController");
const {body}=require('express-validator');
const router = express.Router();

router.get('/getBusRouteDetails/:busId',authenticateToken,driverController.getBusRouteDetails);


router.patch("/updateBusStop/:busId",authenticateToken, driverController.updateBusStop);

router.post("/sendNotification/:busId",authenticateToken, driverController.sendNotification);

router.get("/parcels/:busId", authenticateToken, driverController.getBusParcels);
router.post("/users/batch", authenticateToken, driverController.getUsersBatch);
router.post("/generate-code", authenticateToken, driverController.generateCode);
router.post("/verify-code", authenticateToken, driverController.verifyCode);

// actions this routes need to be checked by tommorow
router.patch("/mark-delivered/:parcelId", authenticateToken, driverController.markDelivered);
router.patch("/remove-parcel/:parcelId", authenticateToken, driverController.removeParcel);
router.patch("/remove-all/:busId", authenticateToken, driverController.removeAllParcels);

// remove selected (frontend supplies parcelIds)
router.patch("/remove-selected", authenticateToken, driverController.removeSelectedParcels);

// notifications
router.post("/notification/:busId", authenticateToken, driverController.notification);
router.post("/notification-selected/:busId", authenticateToken, driverController.notificationSelected);

module.exports = router;
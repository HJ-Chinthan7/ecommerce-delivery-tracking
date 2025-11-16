const express = require('express');
const router=express.Router();
const {body}=require('express-validator');
const AdminController=require("../controllers/adminController");
const authenticateAdmin = require('../middleware/authAdmin.middleware');

router.post('/adminLogin',[body("email").isEmail().withMessage("Invalid Email"),
body("password").isLength({min:6}).withMessage("Password must be at least 6 characters"),
body("role").notEmpty().withMessage("Role is required")
],AdminController.AdminLogin);

router.post("/registerDriver", authenticateAdmin, AdminController.registerDriver);

router.get("/getRegionDrivers", authenticateAdmin, AdminController.getRegionDrivers);

router.get("/getRegionBuses/:regionId", authenticateAdmin, AdminController.getRegionBuses);

router.get("/getRegionParcels/:regionId", authenticateAdmin, AdminController.getRegionParcels);

router.put("/assign-bus", authenticateAdmin, AdminController.assignBus);

router.patch("/assign-bus", authenticateAdmin, AdminController.assignBusToParcels);

router.patch("/unassign-bus", authenticateAdmin, AdminController.unassignParcelsFromBus);

router.patch("/remove-region", authenticateAdmin, AdminController.removeParcelsRegion);

router.get("/parcels/unassigned/:regionId", authenticateAdmin, AdminController.getUnassignedParcels);

router.get("/parcels/assigned/:regionId", authenticateAdmin, AdminController.getAssignedParcels);

router.get("/parcels/address-changed/:regionId", authenticateAdmin, AdminController.getAddressChangedParcels);

router.post("/AdminLogout",authenticateAdmin, AdminController.AdminLogout);
module.exports=router;

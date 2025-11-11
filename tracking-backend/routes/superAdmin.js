const express = require('express');
const router=express.Router();
const superAdminController=require("../controllers/superAdminController");
const {body}=require('express-validator');
const SuperAdmin = require('../models/SuperAdmin');
const authenticateSuperAdmin = require('../middleware/authSuperAdmin.middleware');


router.post('/superAdminLogin',[body("email").isEmail().withMessage("Invalid Email"),
body("password").isLength({min:6}).withMessage("Password must be at least 6 characters"),
body("role").notEmpty().withMessage("Role is required")
],superAdminController.superAdminLogin);

//implement middleware for authentication and authorizationhere for superadmin routes
router.post("/createregion",authenticateSuperAdmin, superAdminController.createRegion);
router.put('/approveDriver/:driverId', authenticateSuperAdmin, superAdminController.approveDriver);
router.post("/createadmin",authenticateSuperAdmin, superAdminController.createAdmin);
router.post("/createbus", authenticateSuperAdmin, superAdminController.createBus);
router.get("/getalladmins",authenticateSuperAdmin, superAdminController.getAllAdmins);
router.get("/getallregions",authenticateSuperAdmin, superAdminController.getAllRegions);
router.get("/getallbuses",authenticateSuperAdmin, superAdminController.getAllBuses);
router.get("/getalldrivers",authenticateSuperAdmin, superAdminController.getAllDrivers);
router.post("/superAdminLogout",authenticateSuperAdmin, superAdminController.superAdminLogout);

module.exports=router;




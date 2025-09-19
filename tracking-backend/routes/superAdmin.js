const express = require('express');
const router=express.Router();
const superAdminController=require("../controllers/superAdminController");
const {body}=require('express-validator');
const SuperAdmin = require('../models/SuperAdmin');



router.post('/superAdminLogin',[body("email").isEmail().withMessage("Invalid Email"),
body("password").isLength({min:6}).withMessage("Password must be at least 6 characters"),
body("role").notEmpty().withMessage("Role is required")
],superAdminController.superAdminLogin);

//implement middleware for authentication and authorizationhere for superadmin routes
router.post("/createregion", superAdminController.createRegion);
router.put('/approveDriver',superAdminController.approveDriver),
router.post("/createadmin", superAdminController.createAdmin);
router.post("/createbus", superAdminController.createBus);
router.get("/getalladmins", superAdminController.getAllAdmins);
router.get("/getallregions", superAdminController.getAllRegions);
router.get("/getallbuses", superAdminController.getAllBuses);
router.get("/getalldrivers", superAdminController.getAllDrivers);
router.post("/superAdminLogout", superAdminController.superAdminLogout);

module.exports=router;




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


router.get("/getRegionBuses", authenticateAdmin, AdminController.getRegionBuses);


router.get("/getRegionParcels", authenticateAdmin, AdminController.getRegionParcels);



router.put("/assign-bus", authenticateAdmin, AdminController.assignBus);

//here tghe assign parcel function is pending do it and remove the //
//router.put("/assign-parcel", authenticateAdmin, AdminController.assignParcel);


router.post("/AdminLogout",authenticateAdmin, AdminController.AdminLogout);
module.exports=router;

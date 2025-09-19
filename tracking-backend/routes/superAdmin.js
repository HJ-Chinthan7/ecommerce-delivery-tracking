const express = require('express');
const router=express.Router();
const superAdminController=require("../controllers/superAdminController");
const {body}=require('express-validator');
const SuperAdmin = require('../models/SuperAdmin');
router.post('/superAdminLogin',[body("email").isEmail().withMessage("Invalid Email"),
body("password").isLength({min:6}).withMessage("Password must be at least 6 characters"),
body("role").notEmpty().withMessage("Role is required")
],superAdminController.superAdminLogin);


router.post("/region", superAdminController.createRegion);
router.post("/createadmin", superAdminController.createAdmin);
router.post("/createbus", superAdminController.createBus);
module.exports=router;




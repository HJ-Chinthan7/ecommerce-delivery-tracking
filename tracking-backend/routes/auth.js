const express = require('express');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const Bus = require('../models/Bus');
const driverController=require("../controllers/driverController");
const {body}=require('express-validator');
const router = express.Router();

router.post('/busLogin',[body('email').isEmail().withMessage("Invalid email"),
body('password').isLength({min:6}).withMessage("Password must be at least 6 characters"),
],driverController.driverLogin);


router.post('/registerDriver',[body("email").isEmail().withMessage("Invalid Email"),
body("password").isLength({min:6}).withMessage("Password must be at least 6 characters"),
body("name").notEmpty().withMessage("Name is required"),
body("driverId").notEmpty().withMessage("Driver ID is required"),
body("busId").notEmpty().withMessage("Bus ID is required"),
],driverController.driverRegister);

module.exports = router;

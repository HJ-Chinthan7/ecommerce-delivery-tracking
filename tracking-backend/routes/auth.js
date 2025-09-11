const express = require('express');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const Bus = require('../models/Bus');
const driverController=require("../controllers/driverController");
const router = express.Router();

router.post('/busLogin',driverController.driverLogin);


router.post('/registerDriver',driverController.driverRegister);

module.exports = router;

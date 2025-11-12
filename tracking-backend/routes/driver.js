const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const driverController=require("../controllers/driverController");
const {body}=require('express-validator');
const router = express.Router();

router.get('/getBusRouteDetails/:busId',authenticateToken,driverController.getBusRouteDetails);


router.patch("/updateBusStop/:busId",authenticateToken, driverController.updateBusStop);





module.exports = router;
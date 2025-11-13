const express = require("express");
const router = express.Router(); 
const trackingController = require("../controllers/trackingController");
router.get("/:busId",trackingController.tracking); 

module.exports = router;

const express = require("express");
const router = express.Router();
const buses = require("../memoryStorage"); 

router.get("/:busId", (req, res) => {
  const { busId } = req.params;
  if (buses[busId]) {
    res.json({ success: true, location: buses[busId] });
  } else {
    res.status(404).json({ success: false, message: "Bus not found" });
  }
});

module.exports = router;

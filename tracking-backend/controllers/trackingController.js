
const buses = require("../memoryStorage");
module.exports.tracking=(req, res) => {
  const { busId } = req.params;
  if (buses[busId]) {
    res.json({ success: true, location: buses[busId] });
  } else {
    res.status(404).json({ success: false, message: "Bus not found" });
  }
}



const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.userId).populate('regionId');
    if (!admin) {
      return res.status(401).json({ error: "Admin not found or deleted" });
    }

    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
module.exports = authenticateAdmin;
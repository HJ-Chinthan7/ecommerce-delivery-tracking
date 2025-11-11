const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/SuperAdmin");
const authenticateSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    const superAdmin = await SuperAdmin.findById(decoded.userId);
    if (!superAdmin || superAdmin.role !== "superadmin") {
      return res.status(403).json({ error: "SuperAdmin access required" });
    }

    req.user = superAdmin;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
module.exports = authenticateSuperAdmin;
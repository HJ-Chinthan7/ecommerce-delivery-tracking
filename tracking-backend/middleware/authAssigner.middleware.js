
const jwt = require("jsonwebtoken");
const Assigner = require("../models/Assigner");
const authAssigner = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];
   if(!token)  token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const assigner = await Assigner.findById(decoded.userId).select("-password");
    if (!assigner) return res.status(401).json({ message: "Assigner not found" });
    req.assigner = assigner;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authAssigner;
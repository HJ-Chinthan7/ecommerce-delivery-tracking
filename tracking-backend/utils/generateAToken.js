const jwt = require("jsonwebtoken");

const generateAdminToken = (adminData) => {
  const token = jwt.sign(
    {
      userId: adminData._id,
      email: adminData.email,
      role: "admin",
      regionId: adminData.regionId, 
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

module.exports = generateAdminToken;

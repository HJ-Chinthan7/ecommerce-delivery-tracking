const jwt = require("jsonwebtoken");

const generateSuperAdminToken = (superAdminData) => {
  const token = jwt.sign(
    {
      userId: superAdminData._id,
      email: superAdminData.email,
      role: "superadmin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

module.exports = generateSuperAdminToken;

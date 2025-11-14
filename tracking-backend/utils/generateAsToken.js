const jwt = require("jsonwebtoken");

const generateAssignerToken = (assignerData) => {
  return jwt.sign(
    {
      userId: assignerData._id,
      email: assignerData.email,
      role: "assigner",
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = generateAssignerToken;

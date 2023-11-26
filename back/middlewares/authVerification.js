/** @format */

const jwt = require("jsonwebtoken");
const RevokedToken = require("../models/RevokedToken");

const authVerification = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const isRevoked = await RevokedToken.findOne({ token });

    if (isRevoked) {
      return res
        .status(403)
        .json({ message: "Access token revoked. Log in again!" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      req.user = decoded.userInfo.username;
      req.role = decoded.userInfo.role;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authVerification;

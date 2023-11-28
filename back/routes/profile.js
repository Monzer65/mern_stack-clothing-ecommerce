/** @format */

const express = require("express");
const router = express.Router();
const jwtAuth = require("../middlewares/jwtAuth");
const User = require("../models/User");
const RevokedToken = require("../models/RevokedToken");
const errorHandler = require("../middlewares/errorHandler");

router.use(errorHandler);

router.get("/:id", jwtAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id username email address"
    );
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", jwtAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    // Input validation
    const { username, email, address, oldPassword, newPassword } = req.body;
    if (!username && !email && !address && !newPassword) {
      return res.status(400).send("No fields to update");
    }

    // Update user fields
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (address) {
      user.address = address;
    }
    if (newPassword) {
      const isOldPasswordValid = await user.comparePassword(oldPassword);
      if (!isOldPasswordValid) {
        return res.status(401).send("Invalid old password");
      }
      user.password = newPassword;
    }

    const updatedUser = await user.save();

    const sanitizedUser = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      address: updatedUser.address,
    };

    return res.status(200).json(sanitizedUser);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID" });
    } else {
      console.error(error);
      next(error);
    }
  }
});

router.delete("/:id", jwtAuth, async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    //clear refresh token and revoke access token (log out the user)
    const oldAccessToken = req.headers.authorization.split(" ")[1];

    const revokedToken = await RevokedToken.create({ token: oldAccessToken });

    if (!revokedToken) {
      return res.status(500).json({ message: "Failed to revoke token" });
    }

    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      return res.sendStatus(204);
    }

    const refreshToken = cookies.refreshToken;

    res.clearCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res
      .status(200)
      .json({ message: `User: ${deletedUser.username} deleted successfully` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

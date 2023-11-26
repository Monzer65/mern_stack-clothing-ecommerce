/** @format */

const express = require("express");

const router = express.Router();

const User = require("../models/User");
const authVerification = require("../middlewares/authVerification");

router.get("/", authVerification, async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      const error = new Error("Users not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(users);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

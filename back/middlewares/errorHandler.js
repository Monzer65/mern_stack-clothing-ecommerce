/** @format */

const express = require("express");
const router = express.Router();

// handling errors middleware
router.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

module.exports = router;

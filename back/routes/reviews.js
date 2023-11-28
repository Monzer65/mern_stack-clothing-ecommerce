/** @format */

const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id).populate("author product");
  if (!review) {
    const error = new Error("Review not found");
    error.status = 404;
    throw error;
  }
  res.status(200).json(review);
});
module.exports = router;

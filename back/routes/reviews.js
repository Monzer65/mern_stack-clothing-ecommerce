/** @format */

const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const User = require("../models/User");
const jwtAuth = require("../middlewares/jwtAuth");

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id).populate("author product");
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  res.status(200).json(review);
});

router.post("/:id", jwtAuth, async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(404).json({ message: "login to write a review" });
    }

    const review = new Review(req.body);

    const existingReview = await Review.findOne({
      author: req.userId,
      product: req.params.id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already have a review for this product",
      });
    }

    if (!review.comment || !review.rating) {
      const error = new Error("Comment and rating are required");
      error.status = 400;
      throw error;
    }

    review.author = req.userId;
    review.product = req.params.id;
    const newReview = await review.save();
    res
      .status(201)
      .json({ rating: newReview.rating, comment: newReview.comment });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", jwtAuth, async (req, res, next) => {
  if (req.role[0] !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required." });
  }

  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid review ID" });
    } else {
      next(error);
    }
  }
});

router.put("/:id", jwtAuth, async (req, res, next) => {
  if (req.role[0] !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required." });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid review ID" });
    } else {
      next(error);
    }
  }
});
module.exports = router;

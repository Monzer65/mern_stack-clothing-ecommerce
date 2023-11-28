/** @format */

const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const { categoryValidation } = require("../middlewares/validation");
const adminAuth = require("../middlewares/adminAuth");
const errorHandler = require("../middlewares/errorHandler");

router.use(errorHandler);

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      const error = new Error("Categories not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(categories);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(category);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid category ID" });
    } else {
      next(error);
    }
  }
});

router.post("/", adminAuth, categoryValidation, async (req, res, next) => {
  const category = new Category(req.body);
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", adminAuth, async (req, res, next) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid category ID" });
    } else {
      next(error);
    }
  }
});

router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid category ID" });
    } else {
      next(error);
    }
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const { categoryValidation } = require("../middlewares/validation");
const jwtAuth = require("../middlewares/jwtAuth");

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      throw new Error("Categories not found");
    }

    const calculateCategoryLevel = async (categoryId, level) => {
      if (!categoryId) {
        return level; // Base case: Return the level when there's no parent category
      }
      const parentCategory = await Category.findById(categoryId); // Find the parent category by ID
      return calculateCategoryLevel(parentCategory.parentCategory, level + 1); // Recursively calculate the level
    };

    // Add level to each category
    const categoriesWithLevel = await Promise.all(
      categories?.map(async (category) => {
        const level = await calculateCategoryLevel(category.parentCategory, 0);
        return { ...category._doc, level };
      })
    );

    res.json(categoriesWithLevel); // Send categories with their levels as JSON response
  } catch (err) {
    console.error(err);
    next(err);
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

router.post("/", jwtAuth, categoryValidation, async (req, res, next) => {
  if (req.role[0] !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required." });
  }

  const category = new Category(req.body);
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", jwtAuth, async (req, res, next) => {
  if (req.role[0] !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required." });
  }

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

router.delete("/:id", jwtAuth, async (req, res, next) => {
  if (req.role[0] !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required." });
  }

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

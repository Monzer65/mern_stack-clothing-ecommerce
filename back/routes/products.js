/** @format */

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middlewares/adminAuth");
const errorHandler = require("../middlewares/errorHandler");
const Category = require("../models/Category");
const mongoose = require("mongoose");

router.use(errorHandler);

// Recursive function to get all descendant categories
// Recursive function to get all descendant category IDs
// Recursive function to get all descendant category IDs including the parent category
async function getAllCategoryIds(categorySlug) {
  try {
    const category = await Category.findOne({ slug: categorySlug }).exec();

    if (!category) {
      throw new Error("Category not found");
    }

    const descendantCategories = await Category.find({
      parentCategory: category._id,
    }).exec();

    const allDescendantIds = [
      category._id,
      ...(descendantCategories.map((c) => c._id) || ""),
    ];

    return allDescendantIds;
  } catch (err) {
    console.error("Error retrieving category IDs:", err.message);
    return [];
  }
}

router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      search,
      minPrice,
      maxPrice,
      brand,
      discount,
      newArrival,
      category,
      ratings,
    } = req.query;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let pipeline = [];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { longDescription: { $regex: search, $options: "i" } },
            { shortDescription: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
          ],
        },
      });
    } else {
      pipeline.push({
        $match: {},
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceMatch = {};

      if (minPrice !== undefined) {
        priceMatch.$gte = parseInt(minPrice);
      }
      if (maxPrice !== undefined) {
        priceMatch.$lte = parseInt(maxPrice);
      }

      pipeline.push({
        $match: { price: priceMatch },
      });
    }

    if (brand) {
      pipeline.push({ $match: { brand: brand } });
    }

    if (newArrival) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      pipeline.push({
        $match: {
          createdAt: { $gte: oneWeekAgo },
        },
      });
    }

    if (discount) {
      pipeline.push({
        $match: { "discount.isActive": true },
      });
    }

    if (ratings) {
      pipeline.push({
        $match: { "reviews.rating": { $gte: parseInt(ratings) } },
      });
    }

    if (category) {
      const categoryIds = await getAllCategoryIds(category);

      console.log("Category IDs:", categoryIds);

      pipeline.push({
        $match: { category: { $in: categoryIds } },
      });
    }

    const sortOptions = {};

    if (sortBy && sortOrder) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    pipeline.push(
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews",
        },
      },
      {
        $addFields: {
          ratings: "$reviews.rating",
        },
      },
      {
        $unset: "reviews",
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings" },
        },
      }
    );

    const countPipeline = [...pipeline, { $count: "total_count" }];

    pipeline.push(
      { $sort: sortOptions },
      { $skip: startIndex },
      { $limit: limit }
    );

    const products = await Product.aggregate(pipeline);
    const countResult = await Product.aggregate(countPipeline);

    let total;
    if (!countResult[0]) {
      total = 0;
    } else {
      total = countResult[0].total_count;
    }

    res.status(200).json({
      totalProducts: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      resultsInThePage: products.length,
      hasnextPage: endIndex < total,
      nextPage: endIndex < total ? page + 1 : null,
      hasPreviousPage: startIndex > 0,
      previousPage: startIndex > 0 ? page - 1 : null,
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(product);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid product ID" });
    } else {
      next(error);
    }
  }
});

router.post("/", adminAuth, async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", adminAuth, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid product ID" });
    } else {
      next(error);
    }
  }
});

router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json(deletedProduct);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Invalid product ID" });
    } else {
      next(error);
    }
  }
});

module.exports = router;

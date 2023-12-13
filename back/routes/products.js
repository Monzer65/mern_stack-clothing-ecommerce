const express = require("express");
const router = express.Router();
const jwtAuth = require("../middlewares/jwtAuth");
const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;

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

    const numericLimit = parseInt(limit, 10); // Convert limit to a number
    if (isNaN(numericLimit)) {
      return res.status(400).send("Limit must be a number");
    }

    const startIndex = (page - 1) * numericLimit;
    const endIndex = page * numericLimit;
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
      const brandRegex = new RegExp(brand, "i"); // 'i' flag for case insensitivity
      pipeline.push({ $match: { "brand.name": { $regex: brandRegex } } });
    }

    if (newArrival) {
      console.log("newArrival:", newArrival);
      pipeline.push({
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  "$createdAt",
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                ],
              }, // Check for newArrival
            ],
          },
        },
      });
      console.log("pipeline:", pipeline);
    }

    if (discount) {
      pipeline.push({
        $match: { $expr: { $eq: ["$discount.isActive", true] } },
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
          reviewsCount: { $size: "$reviews" },
        },
      },
      {
        $unset: "reviews",
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings" },
          reviewsCount: { $sum: "$reviewsCount" },
        },
      }
    );

    const countPipeline = [...pipeline, { $count: "total_count" }];

    pipeline.push(
      { $sort: sortOptions },
      { $skip: startIndex },
      { $limit: numericLimit }
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

router.get("/brands", async (req, res, next) => {
  try {
    const brands = await Product.aggregate([
      {
        $group: {
          _id: "$brand.name", // Group by the brand name
          featured: { $first: "$brand.featured" }, // Get the 'featured' field from the first document in each group
          image: { $first: "$brand.image" }, // Get the 'image' field from the first document in each group
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          name: "$_id", // Set the name of the brand
          featured: 1, // Include the 'featured' field
          image: 1, // Include the 'image' field
        },
      },
    ]);
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const product = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
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
          reviewRatings: "$reviews.rating",
          reviewsCount: { $size: "$reviews" },
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $eq: [{ $size: "$reviewRatings" }, 0] },
              then: 0, // Set a default value when there are no reviews
              else: { $avg: "$reviewRatings" },
            },
          },
          // Unset the unnecessary reviewRatings field after calculating averageRating
          reviewRatings: { $ifNull: ["$reviewRatings", "$$REMOVE"] },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "populatedCategory",
        },
      },
    ]);

    if (product.length === 0) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json(product);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid product ID" });
    } else {
      next(error);
    }
  }
});

router.post("/", jwtAuth, async (req, res, next) => {
  if (req.role[0] !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required." });
  }
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
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

router.delete("/:id", jwtAuth, async (req, res, next) => {
  if (req.role[0] !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required." });
  }
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

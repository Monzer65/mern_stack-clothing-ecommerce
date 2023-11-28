/** @format */

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middlewares/adminAuth");
const errorHandler = require("../middlewares/errorHandler");

router.use(errorHandler);

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
      reviews,
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

    const sortOptions = {};

    if (sortBy && sortOrder) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const countPipeline = [...pipeline, { $count: "total_count" }];

    pipeline.push(
      { $sort: sortOptions },
      { $skip: startIndex },
      { $limit: limit }
    );

    const products = await Product.aggregate(pipeline);
    const countResult = await Product.aggregate(countPipeline);

    res.status(200).json({
      totalProducts: countResult[0].total_count,
      currentPage: page,
      totalPages: Math.ceil(countResult[0].total_count / limit),
      resultsInThePage: products.length,
      hasnextPage: endIndex < countResult[0].total_count,
      nextPage: endIndex < countResult[0].total_count ? page + 1 : null,
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

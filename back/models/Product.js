/** @format */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [50, "Product name cannot exceed 50 characters"],
  },
  shortDescription: {
    type: String,
    trim: true,
  },
  longDescription: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Product price cannot be negative"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product category is required"],
  },
  variations: [
    {
      color: {
        type: String,
        trim: true,
      },
      size: {
        type: String,
        trim: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  brand: {
    type: String,
    trim: true,
  },
  images: [
    {
      type: String, // Assuming storing image URLs
      trim: true,
    },
  ],
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

productSchema.post("save", function (doc) {
  console.log("Product saved:", doc);
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

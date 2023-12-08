const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const cart = await Cart.findById(id).populate("products.productId");
  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }
  res.status(200).json(cart);
});

module.exports = router;

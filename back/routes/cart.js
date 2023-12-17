const express = require("express");
const router = express.Router();
const jwtAuth = require("../middlewares/jwtAuth");
const Cart = require("../models/Cart");

router.get("/", jwtAuth, async (req, res, next) => {
  const { userId } = req;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      const error = new Error("Cart not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.post("/", jwtAuth, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const { userId } = req;

    if (!productId || !quantity || isNaN(quantity)) {
      res.status(400);
      throw new Error(
        "productId and quantity are required and must be numbers"
      );
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const existingProductIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // Product already exists in the cart
        cart.products[existingProductIndex].quantity += parseInt(quantity, 10);
      } else {
        // Product doesn't exist, add it to the cart
        cart.products.push({ productId, quantity: parseInt(quantity, 10) });
      }
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

// Update Cart Item Quantity:
router.put("/:productId", jwtAuth, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const { userId } = req;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    if (!productId) {
      res.status(400);
      throw new Error("productId is required");
    }

    if (quantity < 1) {
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { products: { productId } } },
        { new: true }
      );

      return res.status(200).json(updatedCart);
    }

    if (isNaN(quantity)) {
      res.status(400);
      throw new Error("quantity must be a number");
    }

    const existingProduct = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!existingProduct) {
      res.status(404);
      throw new Error("Product not found in cart");
    }

    existingProduct.quantity = parseInt(quantity, 10);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

// Remove Item from Cart:
router.delete("/:productId", jwtAuth, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { userId } = req;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const updatedProducts = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    cart.products = updatedProducts;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

// Clear Cart:
router.delete("/", jwtAuth, async (req, res, next) => {
  try {
    const { userId } = req;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    cart.products = [];

    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

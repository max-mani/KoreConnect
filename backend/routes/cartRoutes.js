import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Menu from "../models/Menus.js";
import Order from "../models/Order.js";
import crypto from "crypto"; // To generate unique order numbers

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, itemId, quantity = 1 } = req.body;

    console.log("Add to cart request:", { userId, itemId, quantity });

    // Convert userId and itemId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid userId or itemId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const menuItem = await Menu.findById(itemId);
    if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

    // Initialize cart if not present
    if (!user.cart) user.cart = [];

    // Check if item already exists in cart - ensure we're comparing strings properly
    const existingItemIndex = user.cart.findIndex(item => 
      item._id && item._id.toString() === itemId.toString()
    );
    
    console.log(`Item exists in cart at index: ${existingItemIndex}`);
    
    if (existingItemIndex !== -1) {
      // If item exists, update the quantity by adding the new quantity to the existing quantity
      const newQuantity = user.cart[existingItemIndex].quantity + parseInt(quantity);
      user.cart[existingItemIndex].quantity = newQuantity;
      await user.save();
      
      return res.status(200).json({ 
        message: `Cart updated! Total quantity: ${newQuantity}`, 
        cart: user.cart 
      });
    }

    // Clone the menu item and add quantity property
    const itemWithQuantity = {
      ...menuItem.toObject(),
      quantity: parseInt(quantity)
    };

    user.cart.push(itemWithQuantity);
    await user.save();

    res.status(200).json({ 
      message: `${quantity} item(s) added to cart`, 
      cart: user.cart 
    });
  } catch (error) {
    console.error("Error in /add route:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// View cart
router.get("/viewCart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user (no need to populate cart)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return the cart directly
    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Checkout and create order
router.post("/checkout/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user (no need to populate cart)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Generate a unique order number
    const orderNumber = `ORD-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Create new order using cart data directly
    const newOrder = new Order({
      userId: user._id,
      orderNumber,
      customerName: user.name,
      email: user.email,
      paymentStatus: "Pending",
      status: "Processing",
      items: user.cart.map((item) => ({ 
        name: item.name, 
        price: item.price,
        quantity: item.quantity || 1
      })),
      totalAmount: user.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
    });

    await newOrder.save();

    // Clear user cart
    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update quantity for an item in the cart
router.post("/update", async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    console.log("Update request received:", { userId, itemId, quantity });

    if (!userId || !itemId || quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure quantity is a positive number
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the item in the cart using a more reliable string comparison
    const cartItemIndex = user.cart.findIndex(item => 
      item._id && item._id.toString() === itemId.toString()
    );
    
    console.log("Cart item index:", cartItemIndex);
    
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity
    user.cart[cartItemIndex].quantity = quantityNum;
    
    // Save user with updated cart
    await user.save();

    console.log("Updated cart item:", user.cart[cartItemIndex]);

    res.status(200).json({ 
      message: "Quantity updated successfully", 
      cart: user.cart 
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Remove an item from the cart
router.post("/remove", async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    console.log("Remove request received:", { userId, itemId });

    if (!userId || !itemId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User cart before removal:", user.cart);

    // Find the item in the cart using toString() for safe comparison
    const cartItemIndex = user.cart.findIndex(item => 
      item._id && item._id.toString() === itemId.toString()
    );
    
    console.log("Item to remove index:", cartItemIndex);
    
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from cart
    user.cart.splice(cartItemIndex, 1);
    
    // Save user with updated cart
    await user.save();

    console.log("User cart after removal:", user.cart);

    res.status(200).json({ 
      message: "Item removed from cart successfully", 
      cart: user.cart 
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;

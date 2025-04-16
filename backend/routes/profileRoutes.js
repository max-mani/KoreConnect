import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * @route   GET /profile/users/:userId
 * @desc    Fetch user profile details by userId
 * @access  Private
 */
router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user by ID and exclude password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   GET /profile/orders/user/:userId
 * @desc    Fetch all orders of a specific user
 * @access  Private
 */
router.get("/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find orders associated with the user ID
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   PUT /profile/users/:userId
 * @desc    Update user profile details (name, email, etc.)
 * @access  Private
 */
router.put("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    // Find user and update details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   DELETE /profile/users/:userId
 * @desc    Delete user account
 * @access  Private
 */
router.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user and delete
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

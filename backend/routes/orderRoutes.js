import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Fetch all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

router.get("/getorder/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id); // Fetch by MongoDB ObjectId
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch order" });
    }
});

// ✅ Update Order Status by ID
router.put("/updateStatus/:id", async (req, res) => {
    try {
        const { id } = req.params; // Get order ID from URL
        const { status } = req.body; // Get new status from request body

        // Find and update the order
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status }, // Update status field
            { new: true } // Return updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Failed to update order status" });
    }
});

router.get("/userOrder/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user." });
      }
  
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
export default router;

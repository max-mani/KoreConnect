const Order = require("../models/Order");

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  const { orderNumber, status, customer } = req.body;

  if (!orderNumber || !status || !customer) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newOrder = new Order({ orderNumber, status, customer });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update an order
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };

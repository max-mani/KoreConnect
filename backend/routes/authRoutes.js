import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("📩 Signup Request Body:", req.body);
    
    const { name, email, password, phone, city, state, role } = req.body;
    
    // Check if all fields are provided
    if (!name || !email || !password || !phone || !city || !state || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }
    
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }
    
    // Store password directly without hashing
    const newUser = new User({
      name,
      email,
      password, // Store plain password
      phone,
      city,
      state,
      role,
    });
    
    await newUser.save();
    console.log("✅ User Registered Successfully:", newUser);
    
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("⚠ Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("🔍 Login Request Received:", req.body);
    
    const { email, password, role } = req.body;
    
    // Check if all fields are provided
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    console.log("🛠 User Found in DB:", user);
    
    if (!user) {
      return res.status(400).json({ error: "User not found. Please sign up." });
    }
    
    console.log("🔑 Entered Password:", password);
    console.log("🔑 Stored Password in DB:", user.password);
    
    // Direct password comparison instead of bcrypt
    const isPasswordValid = (password === user.password);
    console.log("✅ Password Match:", isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    
    // Check if role matches
    if (user.role !== role) {
      return res.status(400).json({ error: "Invalid role for this user." });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    // Set cookie for session management
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'strict' can cause issues with redirects
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    console.log("✅ Login Successful!");
    res.status(200).json({ 
      message: "Login successful!", 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    console.error("⚠ Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Verify Token Route
router.post("/verify-token", async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, error: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists in database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ valid: false, error: "User not found" });
      }
      
      // All checks passed, token is valid
      res.status(200).json({ 
        valid: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("⚠ Token Verification Error:", error.message);
      return res.status(401).json({ valid: false, error: "Invalid token" });
    }
  } catch (error) {
    console.error("⚠ Verify Token Error:", error);
    res.status(500).json({ valid: false, error: "Internal Server Error" });
  }
});

// ✅ Register Session Route
router.post("/register-session", async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Log the session (in a real app, you would store this in a database)
      console.log(`✅ Session registered for user ${decoded.id}`);
      
      // Set a session cookie
      res.cookie('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("⚠ Session Registration Error:", error.message);
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
  } catch (error) {
    console.error("⚠ Register Session Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ Logout Route
router.post("/logout", (req, res) => {
  try {
    // Clear the session cookie
    res.clearCookie('session');
    
    // In a real app, you would invalidate the session in your database
    console.log("✅ User logged out successfully");
    
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("⚠ Logout Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;

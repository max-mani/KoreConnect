import express from "express";
import multer from "multer";
import path from "path";
import Menu from "../models/Menus.js";

const router = express.Router();

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// ✅ 1. Fetch All Menus
router.get("/getmenu", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menus" });
  }
});

// ✅ 2. Add a New Menu (With Image Upload)
router.post("/addmenu", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { name, price, category, stock } = req.body;
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newMenu = new Menu({ name, price, category, stock, imageUrl });
    await newMenu.save();

    res.json({ message: "Menu added successfully", imageUrl });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({ error: "Server error while adding menu" });
  }
});

// Example in Express
router.get('/images', (req, res) => {
  // Logic to fetch images from database or filesystem
  // Example with MongoDB:
  ImageModel.find()
    .then(images => res.json(images))
    .catch(err => res.status(500).json({ error: err.message }));
});


// ✅ 3. Update an Existing Menu
router.put("/:id", async (req, res) => {
  try {
    const { name, price, category, stock, imageUrl } = req.body;
    await Menu.findByIdAndUpdate(req.params.id, { name, price, category, stock, imageUrl });

    res.json({ message: "Menu updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating menu" });
  }
});

// ✅ 4. Delete a Menu
router.delete("/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting menu" });
  }
});

export default router;

const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/User.js");

const fs = require('fs');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/avatars/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Signup route with avatar upload
router.post("/signup", upload.single("avatar"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.path : "";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = new User({ name, email, password, avatar });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "User created", token });
  } catch (err) {
    console.error("Signup error:", err); 
    res.status(500).json({ message: "Server error" });
  }
});
// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    // console.log(user.password);
    // console.log(password);
    
    const isMatch = await user.comparePassword(password);
    console.log("Incoming login for:", email);
    console.log("User found:", user);
    console.log("Password match:", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

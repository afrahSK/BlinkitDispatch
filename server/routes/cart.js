// routes/cart.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const axios = require('axios');


// 1) central auth
const auth = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};


// 2) ADD TO CART
router.post("/add", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { product } = req.body;
    const existing = user.cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      user.cart.push(product);
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3) GET CART
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// 4) CLEAR CART
router.post("/clear", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});
// Save address
// Save address
router.post('/save-address', auth, async (req, res) => {
  console.log("route hit");
  console.log("Request Body:", req.body);
  const userId = req.user.userId;
  const { name, house, floor, area, phone } = req.body;

  // Add city and country context for accurate geocoding
  const fullAddress = `${house}, ${area}, Ahmedabad, India`;

  try {
    // Use OpenStreetMap Nominatim API (free and public)
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: fullAddress,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'YourAppNameHere (your-email@example.com)' // OSM requires a user-agent header
      }
    });
    console.log("Geo API Response:", geoRes.data);
    if (!geoRes.data.length) {
      return res.status(400).json({ msg: "Unable to fetch coordinates" });
    }

    const lat = parseFloat(geoRes.data[0].lat);
    const lng = parseFloat(geoRes.data[0].lon);

    const user = await User.findByIdAndUpdate(
      userId,
      { address: { name, house, floor, area, phone, lat, lng } },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "Address saved", address: user.address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;

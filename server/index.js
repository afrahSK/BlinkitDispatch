const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use("/api/cart", require("./routes/cart"));
console.log("=== Registered Routes ===");
// app._router.stack
//   .filter(r => r.route)
//   .forEach(r => {
//     const methods = Object.keys(r.route.methods).join(", ").toUpperCase();
//     console.log(methods, r.route.path);
//   });

mongoose.connect('mongodb://127.0.0.1:27017/myAppDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB connection error:", err));

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const fullName = `${firstName} ${lastName}`;
  
    try {
      const newUser = new User({ name: fullName, email, password });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  });
  
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1) Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "No account with that email." });
      }
  
      // 2) Check password
      if (password !== user.password) {
        return res.status(400).json({ msg: "Wrong password." });
      }
      
  
      // 3) Sign a JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // 4) Respond with token
      res.json({ message: "Logged in!", token, name: user.name });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  });
  
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const dharamshalaRoutes = require("./routes/dharamshalaRoutes");
const fs = require("fs");

// ------------------ Create uploads folder if not exists ------------------
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
  console.log("✅ 'uploads' folder created");
}

// ------------------ Express App Setup ------------------
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ------------------ MongoDB Connection ------------------
// Option 1: Use single MONGO_URI env variable
// const mongoUri = process.env.MONGO_URI;

// Option 2: Build URI from separate env variables
const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1); // Stop server if DB connection fails
});

// ------------------ API Routes ------------------
app.use("/api/dharamshalas", dharamshalaRoutes);

// ------------------ Root Route ------------------
app.get("/", (req, res) => {
  res.send("🚀 Dharamshala API is running!");
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

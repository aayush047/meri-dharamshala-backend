const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const dharamshalaRoutes = require("./routes/dharamshalaRoutes");
const fs = require("fs");

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/dharamshalas", dharamshalaRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Dharamshala API running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

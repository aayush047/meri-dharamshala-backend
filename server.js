const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const dharamshalaRoutes = require("./routes/dharamshalaRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// API Routes
app.use("/api/dharamshalas", dharamshalaRoutes);

// Root route (optional, for test)
app.get("/", (req, res) => {
  res.send("🚀 Dharamshala API is running!");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
const dharamshalaRoutes = require("./routes/dharamshalaRoutes");

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/dharamshalas", dharamshalaRoutes);
app.get("/", (req, res) => res.send("🚀 Dharamshala API is running!"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

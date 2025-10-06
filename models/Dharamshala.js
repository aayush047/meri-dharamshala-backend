const mongoose = require("mongoose");

const dharamshalaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hindi: { type: String },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookings: { type: Number, default: 0 },
  image: { type: String, default: "" }, // URL of optimized image
}, {
  timestamps: true // automatically adds createdAt and updatedAt
});

// Optional: create an index for faster queries (if you frequently filter by title or address)
dharamshalaSchema.index({ title: 1 });
dharamshalaSchema.index({ address: 1 });

module.exports = mongoose.model("Dharamshala", dharamshalaSchema);

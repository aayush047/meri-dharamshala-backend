const mongoose = require("mongoose");

const dharamshalaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hindi: { type: String },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookings: { type: Number, default: 0 },
  image: { type: String, default: "" },
});

module.exports = mongoose.model("Dharamshala", dharamshalaSchema);

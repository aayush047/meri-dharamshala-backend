const mongoose = require("mongoose");

const dharamshalaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookings: { type: Number, default: 0 },
  image: { type: String, default: "" },
  ownerId: { type: String, required: true, index: true }, // Firebase UID
}, {
  timestamps: true
});

dharamshalaSchema.index({ title: 1 });
dharamshalaSchema.index({ address: 1 });

module.exports = mongoose.model("Dharamshala", dharamshalaSchema);

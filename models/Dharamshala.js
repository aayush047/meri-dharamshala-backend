// models/Dharamshala.js
const mongoose = require("mongoose");

const dharamshalaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hindi: { type: String },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookings: { type: Number, default: 0 },
  image: { type: String, default: "" }, 
  
  // ✅ NEW FIELD: Store the Firebase UID of the owner, required for ownership
  ownerId: { type: String, required: true, index: true }, 

}, {
  timestamps: true
});

dharamshalaSchema.index({ title: 1 });
dharamshalaSchema.index({ address: 1 });

module.exports = mongoose.model("Dharamshala", dharamshalaSchema);
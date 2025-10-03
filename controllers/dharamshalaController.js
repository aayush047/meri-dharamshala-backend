const Dharamshala = require("../models/Dharamshala");

// GET all
exports.getDharamshalas = async (req, res) => {
  try {
    const data = await Dharamshala.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add
exports.addDharamshala = async (req, res) => {
  try {
    const { title, address, capacity, image } = req.body;
    if (!title || !address || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const dharamshala = new Dharamshala({
      title,
      address,
      capacity,
      bookings: 0,
      image:
        image ||
        "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80",
    });
    const saved = await dharamshala.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update
exports.updateDharamshala = async (req, res) => {
  try {
    const updated = await Dharamshala.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteDharamshala = async (req, res) => {
  try {
    await Dharamshala.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

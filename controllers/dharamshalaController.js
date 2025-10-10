const Dharamshala = require("../models/Dharamshala");
const sharp = require("sharp");
const fs = require("fs");

// OwnerId helper
const getOwnerId = (req) => req.query.ownerId || req.body.ownerId || null;

// ---------------- GET all Dharamshalas ----------------
exports.getDharamshalas = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(401).json({ message: "Owner ID missing." });

    const dharamshalas = await Dharamshala.find({ ownerId }).sort({ createdAt: -1 });
    res.json(dharamshalas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- POST add Dharamshala ----------------
exports.addDharamshala = async (req, res) => {
  try {
    const { title, address, capacity, ownerId } = req.body;
    if (!title || !address || !capacity || !ownerId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let imagePath = "";
    if (req.file) {
      const optimizedPath = `uploads/optimized-${req.file.filename}`;
      await sharp(req.file.path)
        .resize(800, 600, { fit: "inside" })
        .jpeg({ quality: 75 })
        .toFile(optimizedPath);
      fs.unlinkSync(req.file.path);
      imagePath = `https://meri-dharamshala-backend-3.onrender.com/${optimizedPath}`;
    }

    const dharamshala = new Dharamshala({
      title,
      address,
      capacity,
      bookings: 0,
      image: imagePath || "",
      ownerId,
    });

    const saved = await dharamshala.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- PUT update Dharamshala ----------------
exports.updateDharamshala = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(401).json({ message: "Unauthorized." });

    const updateData = req.body;
    delete updateData.ownerId;

    if (req.file) {
      const optimizedPath = `uploads/optimized-${req.file.filename}`;
      await sharp(req.file.path)
        .resize(800, 600, { fit: "inside" })
        .jpeg({ quality: 75 })
        .toFile(optimizedPath);
      fs.unlinkSync(req.file.path);
      updateData.image = `https://meri-dharamshala-backend-3.onrender.com/${optimizedPath}`;
    }

    const updated = await Dharamshala.findOneAndUpdate(
      { _id: req.params.id, ownerId },
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found or unauthorized." });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// ---------------- DELETE Dharamshala ----------------
exports.deleteDharamshala = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(401).json({ message: "Unauthorized." });

    const deleted = await Dharamshala.findOneAndDelete({ _id: req.params.id, ownerId });
    if (!deleted) return res.status(404).json({ message: "Not found or unauthorized." });

    res.json({ message: "Deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

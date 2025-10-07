const Dharamshala = require("../models/Dharamshala");
const sharp = require("sharp");
const fs = require("fs");

// GET all
exports.getDharamshalas = async (req, res) => {
  try {
    const data = await Dharamshala.find({}, "title address capacity bookings image").lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add
exports.addDharamshala = async (req, res) => {
  try {
    const { title, address, capacity } = req.body;
    if (!title || !address || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imagePath = "";
    if (req.file) {
      const optimizedPath = `uploads/optimized-${req.file.filename}`;
      try {
        await sharp(req.file.path)
          .resize(800, 600, { fit: "inside" })
          .jpeg({ quality: 75 })
          .toFile(optimizedPath);
        fs.unlinkSync(req.file.path);

        // ✅ Use public server URL
        imagePath = `https://meri-dharamshala-backend-3.onrender.com/${optimizedPath}`;
      } catch (err) {
        console.error("Image processing failed:", err);
      }
    }

    const dharamshala = new Dharamshala({
      title,
      address,
      capacity,
      bookings: 0,
      image: imagePath || "https://via.placeholder.com/800x600",
    });

    const saved = await dharamshala.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// PUT update
exports.updateDharamshala = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.file) {
      const optimizedPath = `uploads/optimized-${req.file.filename}`;
      await sharp(req.file.path)
        .resize(800, 600, { fit: "inside" })
        .jpeg({ quality: 75 })
        .toFile(optimizedPath);
      fs.unlinkSync(req.file.path);

      // ✅ Fix: use public server URL instead of localhost
      updateData.image = `https://meri-dharamshala-backend-3.onrender.com/${optimizedPath}`;
    }

    const updated = await Dharamshala.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

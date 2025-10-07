const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getDharamshalas,
  addDharamshala,
  updateDharamshala,
  deleteDharamshala
} = require("../controllers/dharamshalaController");

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getDharamshalas);
router.post("/", upload.single("image"), addDharamshala);
router.put("/:id", upload.single("image"), updateDharamshala);
router.delete("/:id", deleteDharamshala);

module.exports = router;

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

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/", getDharamshalas);
router.post("/", upload.single("image"), addDharamshala);
router.put("/:id", upload.single("image"), updateDharamshala);
router.delete("/:id", deleteDharamshala);

module.exports = router;

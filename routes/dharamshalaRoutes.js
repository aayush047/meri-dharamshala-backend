const express = require("express");
const router = express.Router();
const {
  getDharamshalas,
  addDharamshala,
  updateDharamshala,
  deleteDharamshala,
} = require("../controllers/dharamshalaController");

router.get("/", getDharamshalas);
router.post("/", addDharamshala);
router.put("/:id", updateDharamshala);
router.delete("/:id", deleteDharamshala);

module.exports = router;

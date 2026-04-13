const express = require("express");
const router = express.Router();
const translateController = require("../controllers/translateController");

// POST /api/translate
router.post("/", translateController.translateText);

module.exports = router;

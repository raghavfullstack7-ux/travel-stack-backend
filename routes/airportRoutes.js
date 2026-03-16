const express = require("express");
const {
  searchAirports,
  getAirports,
  createAirport
} = require("../controllers/airportController");

const router = express.Router();

router.get("/search", searchAirports);
router.get("/", getAirports);
router.post("/", createAirport);

module.exports = router;
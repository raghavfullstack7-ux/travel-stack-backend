const express = require("express");
const FlightController = require("../controllers/FlightController");

const router = express.Router();

router.get("/search", FlightController.searchFlights);

module.exports = router;

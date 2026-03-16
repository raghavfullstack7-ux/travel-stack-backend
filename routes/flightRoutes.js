const express = require("express");
const FlightController = require("../controllers/FlightController");

const router = express.Router();

router.get("/search", FlightController.searchFlights);
router.post("/sync", FlightController.saveFlights);

module.exports = router;

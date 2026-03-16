const Airport = require("../models/Airport");

/**
 * Search airports (autocomplete for from/to)
 */
const searchAirports = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.length < 2) {
      return res.json({
        status: true,
        data: []
      });
    }

    const airports = await Airport.find({
      $or: [
        // { city: new RegExp(keyword, "i") },
        // { name: new RegExp(keyword, "i") },
        { iata: new RegExp(keyword, "i") }
      ]
    })
      .limit(10)
      .lean();

    res.json({
      status: true,
      message: "Airports fetched successfully",
      data: airports
    });
  } catch (error) {
    console.error("searchAirports error:", error);

    res.status(500).json({
      status: false,
      message: "Failed to search airports"
    });
  }
};

/**
 * Get all airports
 */
const getAirports = async (req, res) => {
  try {
    const airports = await Airport.find().limit(50).lean();

    res.json({
      status: true,
      data: airports
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch airports"
    });
  }
};

/**
 * Create airport (for admin/import)
 */
const createAirport = async (req, res) => {
  try {
    const airport = await Airport.create(req.body);

    res.status(201).json({
      status: true,
      message: "Airport created successfully",
      data: airport
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

module.exports = {
  searchAirports,
  getAirports,
  createAirport
};
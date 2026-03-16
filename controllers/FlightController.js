const Flight = require("../models/Flight");
const { getFlyingFlights } = require("../services/aviation");

/**
 * Search flights from database
 */
const searchFlights = async (req, res) => {
  try {
    const { from, to, date, max = 20 } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        status: false,
        message: "from, to and date query params are required",
      });
    }

    const limit = Math.min(Math.max(Number(max) || 20, 1), 50);

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const flights = await Flight.find({
      origin: from.toUpperCase(),
      destination: to.toUpperCase(),
      departureTime: { $gte: startDate, $lte: endDate },
    })
      .limit(limit)
      .lean();

    return res.status(200).json({
      status: true,
      message: "Flights fetched successfully",
      data: flights,
    });
  } catch (error) {
    console.error("searchFlights error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch flights",
    });
  }
};

/**
 * Save flights from external service to MongoDB
 */
const saveFlights = async (req, res) => {
  try {
    const flightsData = await getFlyingFlights();

    console.log(`Fetched ${flightsData.length} flights from aviation service`);

    const flightsToSave = flightsData.map((flight) => ({
      flightNumber: flight.flight?.iata,
      airline: flight.airline?.name,
      origin: flight.departure?.iata, // use IATA
      destination: flight.arrival?.iata, // use IATA
      departureTime: flight.departure?.scheduled,
      arrivalTime: flight.arrival?.scheduled,
      price: Math.floor(Math.random() * 500) + 100,
    }));

    const savedFlights = await Flight.insertMany(flightsToSave, {
      ordered: false,
    });

    return res.status(201).json({
      status: true,
      message: "Flights saved successfully",
      count: savedFlights.length,
      data: savedFlights,
    });
  } catch (error) {
    console.error("saveFlights error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to save flights",
    });
  }
};

module.exports = {
  searchFlights,
  saveFlights,
};
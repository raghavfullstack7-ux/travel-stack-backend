const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  airline: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, default: 60 },
  status: { type: String, enum: ['scheduled', 'delayed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model("Flight", FlightSchema);

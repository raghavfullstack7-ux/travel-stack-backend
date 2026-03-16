const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  operator: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['AC', 'Non-AC', 'Sleeper'], default: 'AC' },
  seatsAvailable: { type: Number, default: 40 }
}, { timestamps: true });

module.exports = mongoose.model("Bus", BusSchema);

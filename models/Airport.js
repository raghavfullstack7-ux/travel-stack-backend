const mongoose = require("mongoose");

const AirportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    iata: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    icao: {
      type: String,
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/* Index for faster airport search */
AirportSchema.index({ city: 1, name: 1, iata: 1 });

module.exports = mongoose.model("Airport", AirportSchema);
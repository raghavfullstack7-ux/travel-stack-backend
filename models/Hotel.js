const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 0 },
  pricePerNight: { type: Number, required: true },
  amenities: [String],
  images: [String],
  roomsAvailable: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model("Hotel", HotelSchema);

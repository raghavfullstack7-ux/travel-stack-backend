const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['flight', 'hotel', 'bus', 'train'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be guest
  },
  bookingRef: {
    type: String,
    unique: true,
    required: true
  },
  from: String,
  to: String,
  travelDate: Date,
  totalPrice: Number,
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  },
  providerName: String,
  passengers: Number,
  details: Object // Specific details for the booking
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);

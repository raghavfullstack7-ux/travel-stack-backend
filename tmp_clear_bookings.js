const mongoose = require("mongoose");
require("dotenv").config();

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        // Clear Bookings and Payments
        const Booking = require("./models/Booking");
        const Payment = require("./models/Payment");

        await Booking.deleteMany({});
        await Payment.deleteMany({});

        console.log("Cleared all bookings and payments");
        process.exit(0);
    } catch (err) {
        console.error("Error clearing data:", err);
        process.exit(1);
    }
};

clearData();

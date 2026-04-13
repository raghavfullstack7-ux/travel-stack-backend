const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables first

const path = require("path");

const connectDB = require("./libs/connectDB");
const passport = require("passport");
require("./config/passport"); // Import passport strategy configuration
const session = require("express-session");

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// CORS (simple and stable for development)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all local origins for development
      callback(null, true)
    },
    credentials: true,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Test Route
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const flightRoutes = require("./routes/flightRoutes");
const adminRoutes = require("./routes/adminRoutes");
const airportRoutes = require("./routes/airportRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const busRoutes = require("./routes/busRoutes");
const trainRoutes = require("./routes/trainRoutes");
const couponRoutes = require("./routes/couponRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const translateRoutes = require("./routes/translateRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/flights", flightRoutes);
app.use("/admin", adminRoutes);
app.use("/airports", airportRoutes);
app.use("/hotels", hotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/coupons", couponRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/buses", busRoutes);
app.use("/trains", trainRoutes);
app.use("/api/translate", translateRoutes);

// Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
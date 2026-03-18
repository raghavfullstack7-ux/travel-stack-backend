const express = require("express");
const { createBooking, getMyBookings, cancelBooking, verifyPayment } = require("../controllers/bookingController");
const { verifyToken } = require("../services/jwt");

const router = express.Router();

router.post("/create", verifyToken, createBooking);
router.post("/verify", verifyToken, verifyPayment);
router.get("/my", verifyToken, getMyBookings);
router.put("/cancel/:id", verifyToken, cancelBooking);

module.exports = router;

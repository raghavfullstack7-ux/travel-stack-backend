const Booking = require("../models/Booking");
const PaymentModel = require('../models/Payment');
const { createOrder } = require('../services/razorpay');

exports.createBooking = async (req, res) => {
    try {
        const userId = req.user._id;
        const b = req.body;
        console.log("Booking Request Body:", b, "User ID:", userId);
        const booking = new Booking({
            userId,
            type: b.type,
            bookingRef: b.bookingRef || `YT${Math.floor(100000 + Math.random() * 900000)}`,
            from: b.fromCode || b.from,
            to: b.toCode || b.to,
            travelDate: b.travelDate,
            totalPrice: b.totalPrice,
            status: 'pending',
            providerName: b.providerName,
            passengers: b.passengers || 1,
            details: b.details || {}
        });
        await booking.save();
       
        const order = await createOrder(booking.totalPrice);
        const payment = new PaymentModel({
            user: userId,
            amount: booking.totalPrice,
            razorpayOrderId: order.id
        });
        await payment.save();

        res.status(201).json({ success: true, booking, orderId: order.id });
    } catch (error) {
        console.error("Booking Create Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        const { verifySignature } = require("../services/razorpay");

        const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.status = "confirmed";
        booking.paymentDetails = {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature
        };
        await booking.save();

        res.json({ success: true, booking });
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { status: 'cancelled' },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

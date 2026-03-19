const express = require("express");
const { createPayment } = require("../controllers/PaymentController");
const { verifyToken } = require("../services/jwt");

const router = express.Router();

router.post("/create", verifyToken, createPayment);

module.exports = router;

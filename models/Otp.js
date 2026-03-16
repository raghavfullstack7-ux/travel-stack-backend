const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: false
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {timestamps: true})

OTPSchema.pre("validate", function () {
    if (!this.userId && !this.adminId) {
        throw new Error("userId or adminId is required");
    }
});

module.exports = OTPModel = mongoose.model("OTP", OTPSchema)

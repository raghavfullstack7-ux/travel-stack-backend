const razorpay = require('razorpay');

const instance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const crypto = require("crypto");

const createOrder = async (amount) => {
    const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    };
    try {
        const order = await instance.orders.create(options);
        return order;
    } catch (error) {
        throw error;
    }
}

const verifySignature = (orderId, paymentId, signature) => {
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");
    return generatedSignature === signature;
}

module.exports = {
    createOrder,
    verifySignature
}


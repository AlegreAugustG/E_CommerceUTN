const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
    userId: String, // Referencia al usuario que realizó la compra
    shippingInfo: {
        address: String,
    },
    paymentInfo: {
        name: String,
        cardNumber: String,
        expireDate: String,
        CVV: String,
    },
});

module.exports = mongoose.model('Checkout', checkoutSchema);
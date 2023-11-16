const mongoose = require('mongoose');

const checkoutsSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts', // Referencia al modelo 'Cart'
        required: true,
    },
    paymentInfo: {
        name: String,
        cardNumber: String,
        expireDate: String,
        CVV: String,
    },
});

module.exports = mongoose.model('Checkouts', checkoutsSchema);
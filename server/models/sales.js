const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carts',
  },
  paymentInfo: {
    // Incluye los campos necesarios según tu esquema
  },
  // Otros campos de Sales según tu esquema
});

module.exports = mongoose.model('Sales', salesSchema);
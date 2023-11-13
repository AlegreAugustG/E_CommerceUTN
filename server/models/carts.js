const mongoose = require('mongoose');

const cartsSchema = new mongoose.Schema({
   
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId, // Referencia a un producto
                ref: 'Products',
            },
             
            price: Number,
            quantity: Number,
            subtotal: Number,
        },
    ],
    deliveryFee: {
        type: Number,
        default: 0,  
      },
      discount: {
        type: Number,
        default: 0,  
      },
      total: {
        type: Number,
        default: 0,  
      },
    });

module.exports = mongoose.model('Cart', cartsSchema);
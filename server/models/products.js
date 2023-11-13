const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nombre del producto'],
    },
    price: {
        type: Number,
        required: [true, 'Precio del producto'],
    },
    isAvaible: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    description: {
        type: String,
        default: false,
    },
    image: {
        type: String,
        default: false,
    },
    stockQuantity:{
        type:Number,
        default:true,
    },
    category: {
        type: String,
        enum: ['wardrobe', 'beds', 'mattresses', 'dressers', 'drawers'],
    },

});

module.exports = mongoose.model('Products', productsSchema);
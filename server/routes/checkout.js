const express = require('express');
const router = express.Router();
const Productos = require('../models/products');
const Carritos = require('../models/carts');
const Checkouts  = require('../models/checkouts');

// Checkout Form (GET)
router.get('/checkout-form/:cartId', async (req, res) => {
  const cartId = req.params.cartId;
  res.render('user/checkout-form', { cartId });
});
  
  // Handle Checkout Form Submission (POST)
  router.post('/checkout/:cartId', async (req, res) => {
    const cartId = req.params.cartId;
    const { name, cardNumber, expireDate, CVV } = req.body;
  
    try {
      const cart = await Carritos.findById(cartId).populate('items.product');
  
      // Check if the cart exists
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      // Create a new Checkout instance
      const newCheckout = new Checkouts({
        cart: cartId,
        paymentInfo: { name, cardNumber, expireDate, CVV },
      });
  
      // Save the Checkout to the database
      await newCheckout.save();
  
      // Update the user's cart (subtract quantities)
      cart.items.forEach(async (item) => {
        const productIndex = cart.items.findIndex((prod) => prod.product._id.toString() === item.product._id.toString());
        if (productIndex !== -1) {
          cart.items[productIndex].quantity -= item.quantity;
          // Optionally, you can remove items if quantity becomes zero
          // if (cart.items[productIndex].quantity === 0) {
          //   cart.items.splice(productIndex, 1);
          // }
        }
      });
  
      // Save the updated cart
      await cart.save();
  
      res.redirect(`/view-cart/${cartId}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  });

  module.exports = router;
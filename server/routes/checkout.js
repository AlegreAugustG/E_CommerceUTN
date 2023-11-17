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

    // Verifica si el carrito existe
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Crea una nueva instancia de Checkout
    const newCheckout = new Checkouts({
      cart: cartId,
      paymentInfo: { name, cardNumber, expireDate, CVV },
    });

    // Guarda el Checkout en la base de datos
    await newCheckout.save();

    // Actualiza el carrito del usuario (resta cantidades)
    cart.items.forEach(async (item) => {
      const productIndex = cart.items.findIndex((prod) => prod.product._id.toString() === item.product._id.toString());
      if (productIndex !== -1) {
        cart.items[productIndex].quantity -= item.quantity;
        // Opcionalmente, puedes eliminar elementos si la cantidad se vuelve cero
        // if (cart.items[productIndex].quantity === 0) {
        //   cart.items.splice(productIndex, 1);
        // }
      }
    });

    // Guarda el carrito actualizado
    await cart.save();

    // Obtén los datos actualizados del carrito después de la operación
    const updatedCart = await Carritos.findById(cartId).populate('items.product');

    // Renderiza la vista de resumen con los datos actualizados del carrito
    res.render('user/checkout-summary', { checkout: newCheckout, cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Confirmar Compra (POST)
router.post('/confirmar-compra/:checkoutId', async (req, res) => {
  const checkoutId = req.params.checkoutId;
  
  try {
    // Aquí puedes realizar acciones adicionales si es necesario antes de confirmar la compra
  
    // Confirma la compra actualizando el estado del Checkout
    await Checkouts.findByIdAndUpdate(checkoutId, { $set: { confirmed: true } });
  
    res.redirect('/view-sale'); // Puedes redirigir a una página de "Compra Confirmada" o a donde desees
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

module.exports = router;

// sales.js (ruta para el create de Sale)
const express = require('express');
const router = express.Router();
const Cart = require('../models/carts');
const Sale = require('../models/sales'); // Asegúrate de tener el modelo Sale correctamente importado

// Otras rutas y middleware aquí...

// Crear una venta (Sale)
router.post('/create-sale/:cartId', async (req, res) => {
  const cartId = req.params.cartId;

  try {
    // Buscar el carrito asociado a la venta
    const cart = await Cart.findById(cartId).populate('items.product');

    // Verificar si el carrito existe
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Crear una nueva instancia de Sale
    const newSale = new Sale({
      cart: cartId,
      paymentInfo: req.body, // Ajusta según tu estructura de datos para la información de pago
      // Otros campos según tus necesidades
    });

    // Descuentos de la cantidad de productos comprados
    cart.items.forEach(async (item) => {
      const product = item.product;
      const productIndex = cart.items.findIndex((prod) => prod.product._id.toString() === product._id.toString());

      if (productIndex !== -1) {
        // Restar la cantidad comprada al stock del producto
        product.stockQuantity -= item.quantity;

        // Eliminar el producto del carrito si la cantidad es cero
        if (product.stockQuantity === 0) {
          cart.items.splice(productIndex, 1);
        }
      }
    });

    // Eliminar el carrito después de la compra
    //await cart.remove();

    // Guardar la venta en la base de datos
    await newSale.save();

    res.redirect('/list-sales'); // Redirige a la lista de ventas o a donde desees
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

module.exports = router;
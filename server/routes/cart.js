// routes/cart.js
const express = require('express');
const router = express.Router();
const Carritos = require('../models/carts');
const Productos = require('../models/products');

// Rutas para CRUD de carritos

//mostrar la lista de productos
 router.get('/view-product', async (req, res) => {
    try {
        const productos = await Productos.find(); // Obtener productos de la base de datos
        res.render('user/view-product', { productos }); // Pasar los productos a la vista
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron obtener los productos' });
    } 
});
//agregar al carrito 
router.get('/view-product/:productId', async (req, res) => {
  try {
    const productos = await Productos.find();
    const product = await Productos.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.render('user/view-cart', { product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos para agregar al carrito' });
  }
});
//crear el carrito
router.post('/add-to-cart/:productId', async (req, res) => {
  try {
    const product = await Productos.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Lógica para agregar el producto al carrito
    const quantity = 1; // Puedes ajustar la cantidad según tu lógica
    const price = product.price;
    const subtotal = quantity * price;

    const cart = new Carritos({
      items: [{
        product: product._id,
        price,
        quantity,
        subtotal,
      }],
    });

    await cart.save(); // Guarda el carrito actualizado en la base de datos

    res.redirect(`/view-cart/${cart._id}`); // Redirige a la vista del carrito
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});
//ver el carrito creado
router.get('', async (req, res) => {
  try {
    const cart = await Carritos.findById(req.params.cartId).populate('items.product');

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.render('user/view-cart', { cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

//ver todos los carritos
router.get('/view-cart/:cartId', async (req, res) => {
  try {
    const carts = await Carritos.find().populate('items.product');
    res.render('user/view-cart', { carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener carritos' });
  }
});
//eliminar carrito
router.post('/remove-cart/:cartId', async (req, res) => {
  try {
    await Carritos.findByIdAndDelete(req.params.cartId);
    res.redirect('/view-product'); // Redirige después de eliminar el carrito
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar el carrito' });
  }
});



// Modificar carrito
router.post('/update-cart/:cartId', async (req, res) => {
  const { action, quantity } = req.body;

  try {
    const cart = await Carritos.findById(req.params.cartId).populate('items.product');

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.items.findIndex(item => item.product._id.toString() === req.body.productId);

    // Verifica si el producto existe en el carrito
    if (productIndex === -1 || !cart.items[productIndex]) {
      console.error(`Producto no encontrado en el carrito. ID del producto: ${req.body.productId}`);
      console.error('Contenido del carrito:', cart);
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    const price = cart.items[productIndex].price;
    let itemQuantity = cart.items[productIndex].quantity;
    let itemSubtotal = cart.items[productIndex].subtotal;

    // Calcular el total antes de la modificación
    const totalAntes = cart.total;

    switch (action) {
      case 'increase':
        // Aumenta la cantidad
        itemQuantity += 1;
        itemSubtotal = itemQuantity * price;
        break;

      case 'decrease':
        // Disminuye la cantidad
        if (itemQuantity > 1) {
          itemQuantity -= 1;
          itemSubtotal = itemQuantity * price;
        } else {
          // Si la cantidad es 1, elimina el elemento del carrito
          // Puedes decidir si eliminar el producto completamente o solo reducir la cantidad a 0
          
          itemQuantity = 0;
          itemSubtotal = 0;
        }
        break;

      case 'empty-item':
 
        //simplemente reduciré la cantidad a 0
        itemQuantity = 0;
        itemSubtotal = 0;
        break;

      default:
        console.error('Acción no válida');
        break;
    }

    // Actualiza los valores en el carrito
    cart.items[productIndex].quantity = itemQuantity;
    cart.items[productIndex].subtotal = itemSubtotal;

    // Calcula el nuevo total
    const totalDespues = cart.items.reduce((total, item) => total + item.subtotal, 0);

    // Actualiza el total del carrito
    cart.total = totalDespues;

    // Guarda el carrito actualizado en la base de datos
    await cart.save();

    res.redirect(`/view-cart/${req.params.cartId}`); // Redirige a la vista del carrito
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});



module.exports = router;

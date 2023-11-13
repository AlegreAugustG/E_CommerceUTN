 const express = require('express');
const router = express.Router();
const Productos= require('../models/products')
const bcrypt = require('bcrypt');


//CRUD PRODUCTOS
  
router.get('/create-formproduct', (req, res) => {
    res.render('admin/create-formproduct'); // Renderiza la vista de creación de productos
});

router.post('/create-product', async (req, res) => {
    try {
        const nuevoProducto = new Productos(req.body);
        const productoCreado = await nuevoProducto.save();
       // res.status(201).json({ msg: 'Producto creado', producto: productoCreado });
    } catch (error) {
        console.error(error);
       // res.status(500).json({ error: 'No se pudo crear el producto' });
    }
    res.redirect('/list-product'); // Redirige al usuario a la página de creación de productos
});

   

 // Ruta para mostrar la vista de edición (GET)
 router.get('/edit-formproduct/:id', async (req, res) => {
    try {
        const producto = await Productos.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.render('admin/edit-formproduct', { producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


// Ruta para actualizar el producto (POST)
router.post('/edit-product/:id', async (req, res) => {
    try {
        const producto = await Productos.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Actualiza el producto con los datos enviados en la solicitud
        producto.name = req.body.name;
        producto.price = req.body.price;
        producto.isAvaible = req.body.isAvaible === 'on';
        producto.raiting = req.body.raiting;
        producto.description=req.body.description;
        producto.image=req.body.image;
        producto.stockQuantity = req.body.stockQuantity;
        producto.category = req.body.category;
        
        await producto.save(); // Guarda el producto actualizado en la base de datos

        res.redirect('/list-product'); // Redirige a la lista de productos o a donde desees
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


router.post('/list-product/:id', async (req, res) => {
    try {
        await Productos.findByIdAndDelete(req.params.id);
        res.redirect('/list-product'); // Redirige después de eliminar el producto
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
});
 

 router.get('/list-product', async (req, res) => {
    try {
        const productos = await Productos.find(); // Obtener productos de la base de datos
        res.render('admin/list-product', { productos }); // Pasar los productos a la vista
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron obtener los productos' });
    } 
});
    
module.exports=router
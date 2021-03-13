'use strict'

const express = require('express')
const productosController = require('../controladores/productos.controlador');
const md_autentification = require('../middlewares/usuario.authenticated');

var api = express.Router();

api.post('/registroProducto', productosController.registroProducto);
api.put('/editarProducto/:idProducto',md_autentification.ensureAuth, productosController.editarProducto);
api.delete('/elimininarProducto/:idProducto',md_autentification.ensureAuth, productosController.elimininarProducto);
api.get('/obtenerProductoID/:idProducto',md_autentification.ensureAuth, productosController.obtenerProductoID);
api.get('/obtenerProductoNombre/:nombreProducto',md_autentification.ensureAuth, productosController.obtenerProductoNombre);
api.get('/obtenerProductoPorCategoria/:nombreCat',md_autentification.ensureAuth, productosController.obtenerProductoPorCategoria);
api.get('/controlStock/:idProducto',md_autentification.ensureAuth, productosController.controlStock);
api.get('/productosAgotados',md_autentification.ensureAuth, productosController.productosAgotados);
api.get('/masVendidos',md_autentification.ensureAuth,productosController.masVendidos)

module.exports = api;
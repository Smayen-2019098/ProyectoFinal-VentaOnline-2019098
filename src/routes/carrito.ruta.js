'use strict'

const express = require('express')
const carritoControlador = require('../controladores/carrito.controlador');
const md_autentification = require('../middlewares/usuario.authenticated');

var api = express.Router();

api.put('/agregarCarrito',md_autentification.ensureAuth, carritoControlador.agregarCarrito);

module.exports = api;
'use strict'

const express = require('express')
const facturaControlador = require('../controladores/factura.controlador')
const md_autentification = require('../middlewares/usuario.authenticated')

var api = express.Router();

api.get('/crearFactura/:idUsuario', md_autentification.ensureAuth, facturaControlador.crearFactura);
api.get('/obtenerFacturas',md_autentification.ensureAuth,facturaControlador.obtenerFacturas);
api.get('/obtenerFacturaId/:idFactura',md_autentification.ensureAuth,facturaControlador.obtenerFacturaId);
api.get('/facturaDetallada/:idFactura',md_autentification.ensureAuth,facturaControlador.facturaDetallada);

module.exports = api;



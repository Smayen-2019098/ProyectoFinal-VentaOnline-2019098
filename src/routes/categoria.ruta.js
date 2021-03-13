'use strict'

const express = require('express')
const categoriaControlador = require('../controladores/categoria.controlador')
const md_autentification = require('../middlewares/usuario.authenticated')

var api = express.Router();

api.post('/registrarCategoria', categoriaControlador.registrarCategoria);
api.put('/editarCategoria/:idCategoria',md_autentification.ensureAuth, categoriaControlador.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria',md_autentification.ensureAuth, categoriaControlador.eliminarCategoria);
api.get('/obtenerCategorias',md_autentification.ensureAuth, categoriaControlador.obtenerCategorias);

module.exports = api;
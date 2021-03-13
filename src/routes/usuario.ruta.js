'use strict'
const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador')
const md_autentification = require('../middlewares/usuario.authenticated')

var api = express.Router();

api.post('/login', usuarioControlador.login);
api.post('/registrarUsuario', usuarioControlador.registrarUsuario);
api.put('/editarUsuario/:idUsuario',md_autentification.ensureAuth, usuarioControlador.editarUsuario)
api.delete('/eliminarUsuario/:idUsuario',md_autentification.ensureAuth, usuarioControlador.eliminarUsuario);
module.exports = api;
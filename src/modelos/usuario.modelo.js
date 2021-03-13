'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
    nombre: String,
    usuario: String,
    rol: String,
    contraseña: String
})

module.exports = mongoose.model('usuario', usuarioSchema);
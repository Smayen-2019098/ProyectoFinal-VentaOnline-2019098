'use strict'

const mongoose = require('mongoose')
var Schema = mongoose.Schema;


var productosSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    stock: Number,
    cantidadVendida: Number,
    idCategoria: {type: Schema.ObjectId, ref:'categoria'}
})

module.exports = mongoose.model('productos', productosSchema);
'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = Schema({
    idUsuario: { type: Schema.ObjectId, ref: 'usuario' },
    productos: [{
        idProducto: { type: Schema.ObjectId, ref: 'productos' },
        cantidad: Number
    }],
    total: {type: Number, default: 0}
})

module.exports = mongoose.model('factura', facturaSchema);
'use strict'
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")
const registrarAdmin = require('./src/controladores/usuario.controlador')
const creacionDefault = require('./src/controladores/categoria.controlador')
const usuarioRuta = require('./src/routes/usuario.ruta');
const categoriaRuta = require('./src/routes/categoria.ruta');
const productosRuta = require('./src/routes/productos.ruta')
const carritoRuta = require('./src/routes/carrito.ruta');
const facturaRuta = require('./src/routes/factura.ruta')


app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(cors());

registrarAdmin.registroAdmin();
creacionDefault.registrarCategoriaDefault();
app.use('/api',usuarioRuta);
app.use('/api',categoriaRuta);
app.use('/api',productosRuta);
app.use('/api',carritoRuta);
app.use('/api',facturaRuta);


//exportar
module.exports = app;
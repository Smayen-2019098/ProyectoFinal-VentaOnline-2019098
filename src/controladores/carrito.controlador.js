'use strict'

const Carrito = require('../modelos/carrito.modelo')
const jwt = require('../servicios/usuario,jwt');
const usuario = require('../modelos/usuario.modelo');
const controladorUsuario = require('../controladores/usuario.controlador');
const Producto = require('../modelos/productos.modelo');

function crearCarrito( idUsuarioT, res){
    var carritoModel = new Carrito();
    carritoModel.idUsuario = idUsuarioT;
    Carrito.find({$or: [
        {idUsuario: idUsuarioT}
    ]}).exec((err, carritoEncontrado)=>{
        if(err) return console.log('error en la peticion de usuario')
        if(carritoEncontrado && carritoEncontrado.length >=1){
            if(err) return console.log('El carrito ya existe')
        }else{
            carritoModel.save((err, carritoGuardado)=>{
               if(err) return console.log('Error al guardar el carrito' )
                if(!carritoGuardado){
                   return console.log('No se ha podido registrar el carrito')
                }
            })
        }
    })
}

function agregarCarrito(req, res){
    var params = req.body;
    Producto.findById(params.idProducto,(err, productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
        if(!productoEncontrado) return res.status(500).send({mensaje: 'producto no encontrado'})
        var sumaTotal = productoEncontrado.precio * params.cantidad;
            Carrito.findOneAndUpdate({idUsuario: req.usuario.sub}, { $push: { productos: {idProducto: productoEncontrado._id, cantidad: params.cantidad}}},
            {new:true, useFindAndModify: false}, (err, carritoAgregado) =>{ 
                if(err) res.status(500).send({mensaje: 'error en la peticion1'})
                if(!carritoAgregado) return res.status(500).send({mensaje: 'error al agregar al carrito'})
                var totalFinal = sumaTotal + carritoAgregado.total;
                Carrito.findOneAndUpdate({idUsuario: req.usuario.sub},{total: totalFinal},
                    {new:true, useFindAndModify: false}, (err, carritoAgregado2) =>{ 
                if(err) res.status(500).send({mensaje: 'error en la peticion3'})
                if(!carritoAgregado2) return res.status(500).send({mensaje: 'error al agregar al carrito'})
                    return res.status(200).send({carritoAgregado2})                        
                })
            })
    })
}

module.exports = {
    crearCarrito,
    agregarCarrito
}
'use strict '

const Factura = require ('../modelos/factura.modelo');
const jwt = require('../servicios/usuario,jwt');
const usuario = require('../modelos/usuario.modelo');
const controladorUsuario = require('../controladores/usuario.controlador');
const Producto = require('../modelos/productos.modelo');
const Carrito = require('../modelos/carrito.modelo')
const carritoControlador = require('./carrito.controlador');

function crearFactura(req, res){
 var facturaModel = new Factura();
 var idUsuario = req.params.idUsuario;
    Carrito.findOne({idUsuario: idUsuario}, (err, carritoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion0'});
        if(!carritoEncontrado) return res.status(500).send({mensaje: 'carrito no encontrado'})
            facturaModel.idUsuario = carritoEncontrado.idUsuario;
            facturaModel.productos = carritoEncontrado.productos;
            facturaModel.total = carritoEncontrado.total;
            for(let i = 0; i < facturaModel.productos.length; i++) {
             var propiedad = facturaModel.productos[i].idProducto;
             var cant = facturaModel.productos[i].stock;
             Producto.findByIdAndUpdate(propiedad, {$inc: {cantidadVendida: +1}},{new: true, useFindAndModify: false},(err, productoEncontrado)=>{
                 if(err) return res.status(500).send({mensaje: 'error en la peticion1'})
                 if(!productoEncontrado)return res.status(500).send({mensaje: 'no se ha encontrado el producto'});
                    /*Producto.findByIdAndUpdate(propiedad,{stock: productoEncontrado.stock-cant},{new: true, useFindAndModify: false},(err, productoEncontrado2)=>{
                    if(err) return res.status(500).send({mensaje: 'error en la peticion2'})
                    if(!productoEncontrado2) return res.status(500).send({mensaje: 'no se ha encontrado el producto'});
                    })*/
             })
            }
            Carrito.findOneAndDelete( {idUsuario: idUsuario}, (err, carritoEliminado)=>{
                if(err) return res.status(500).send({mensaje: 'error en la petion al eliminar el carrito'})
                if(!carritoEliminado) return res.status(500).send({mensaje: 'error al econtrar el carrito'})
            })                    
            carritoControlador.crearCarrito(idUsuario);
            facturaModel.save((err, facturaGuardada)=>{
                if(err) return res.status(500).send({mensaje: 'Error al guardar el carrito'} )
                 if(!facturaGuardada){
                    return res.status(500).send({mensaje: 'No se ha podido registrar el carrito'})
                 }else{
                     return res.status(200).send({facturaGuardada})
                 }
             })     
    })
}

function obtenerFacturas (req, res){
    if(req.usuario.rol ==='ADMIN'){
    Factura.find((err, facturaEncontrada)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'})
        if(!facturaEncontrada) return res.status(500).send({mensaje: 'error en la consulta'})
        return res.status(200).send({facturaEncontrada})
    })
}else{
    return res.status(500).send({mensaje: 'no tiene los permisos necesarios'})
}
}

function obtenerFacturaId(req, res){
    if(req.usuario.rol ==='ADMIN'){
        var idFactura = req.params.idFactura
            Factura.findById(idFactura, (err, facturaEncontrada)=>{
                if(err) return res.status(500).send({mensaje: 'error en la peticion'})
                if(!facturaEncontrada) return res.status(500).send({mensaje: 'error en la consulta2'})    
                return res.status(200).send(facturaEncontrada.productos)
            }).populate('productos.idProducto', 'nombre precio' )
    }else{
        return res.status(500).send({mensaje: 'no tiene los permisos necesarios'})
    }
}

function facturaDetallada(req, res){
var idFactura = req.params.idFactura
Factura.findById(idFactura, (err, facturaEncontrada)=>{
    if(err) return res.status(500).send({mensaje: 'error en la peticion'})
    if(!facturaEncontrada) return res.status(500).send({mensaje: 'error en la consulta2'})    
    return res.status(200).send(facturaEncontrada)
}).populate('   productos.idProducto', 'nombre descripcion precio ')
}

module.exports ={
    crearFactura,
    obtenerFacturas,
    obtenerFacturaId,
    facturaDetallada
}
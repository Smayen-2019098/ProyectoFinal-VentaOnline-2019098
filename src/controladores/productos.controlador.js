'use strict'

const Productos = require('../modelos/productos.modelo')
const bcrypt = require('bcrypt-nodejs')
const productosModel = require('../modelos/productos.modelo');
const categoriaModelo = require('../modelos/categoria.modelo');
const Categoria = require('../modelos/categoria.modelo')


function registroProducto(req, res){
    var productosModel = new Productos();
    var params = req.body;
    if(params.nombre && params.descripcion && params.precio && params.stock  && params.idCategoria){
        productosModel.nombre = params.nombre,
        productosModel.descripcion = params.descripcion;
        productosModel.precio = params.precio;
        productosModel.stock = params.stock;
        productosModel.idCategoria = params.idCategoria;
        Productos.find({$or:[
            {nombre: productosModel.nombre},
            {descripcion: productosModel.descripcion}
        ]}).exec((err, productoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'})
            if(productoEncontrado && productoEncontrado >=1){
                return res.status(500).send({mensaje: 'el producto ya existe'})
            }else{
                productosModel.save((err, productoGuardado)=>{
                    if(productoGuardado){
                        res.status(200).send({productoGuardado})
                    }else{
                        res.status(404).send({mensaje: 'no se a podido ingresar el producto'});
                    }
                })
            }
        })
    }
}

function editarProducto(req, res){
    var idProducto = req.params.idProducto;
    var params = req.body;
    if(req.usuario.rol === 'ADMIN'){
        productosModel.findByIdAndUpdate(idProducto, params, {new: true, useFindAndModify: false},(err, productoActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'})
        if(!productoActualizado) return res.status(500).send({mensaje: 'no se ha podido encontrar el producto'})
        return res.status(200).send({productoActualizado});
        })
    }else{
        return res.status(500).send({mensaje: 'no tienes los permisos necesarios'})
    }
}

function elimininarProducto(req, res){
    var idProducto = req.params.idProducto;
if(req.usuario.rol ==='ADMIN'){
Productos.findByIdAndDelete(idProducto,(err, productoEliminado)=>{
    if(err) return res.status(500).send({mensaje: 'error en la peticion'})
    if(!productoEliminado) return res.status(500).send({mensaje: 'producto no encontrado'})
    return res.status(200).send({mensaje: 'el producto eliminado es: ', productoEliminado})
})
}else{
    return res.status(500).send({mensaje: 'no tienes los permisos necesarios'})
}
}

// obtener por medio de: cantidad de mas vendidos, stock
function obtenerProductoID(req, res){
var idProducto = req.params.idProducto;
Productos.findById(idProducto, (err, productoEncontrado)=>{
    if(err) return res.status(500).send({mensaje: 'error en la peticion'});
    if(!productoEncontrado) return res.status(500).send({mensaje: 'producto no encontrado'})
    return res.status(200).send({productoEncontrado})

})
}

function obtenerProductoNombre(req, res){
    var nombreProducto = req.params.nombreProducto;
    Productos.findOne({nombre: nombreProducto}, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
        if(!productoEncontrado) return res.status(500).send({mensaje: 'producto no encontrado'})
        return res.status(200).send({productoEncontrado})    
    })
}

function obtenerProductoPorCategoria(req, res){
    var nombreCat = req.params.nombreCat;
    Categoria.findOne({nombre: nombreCat},(err, categoriaEncotrada)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
        if(!categoriaEncotrada) return res.status(500).send({mensaje: 'producto no encontrado'})      
    Productos.find({idCategoria: categoriaEncotrada._id}, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
        if(!productoEncontrado) return res.status(500).send({mensaje: 'productos no encontrado'})
        return res.status(200).send({productoEncontrado})    
    })
    })
}

function controlStock(req, res){
    var idProducto = req.params.idProducto;   
    Productos.findById(idProducto, (err, productoEncontrado)=>{
        if(productoEncontrado.stock != 0){
            return res.status(200).send({mensaje: 'producto disponible'})

        }else{
            return res.status(500).send({mensaje: 'producto agotado' })
        }
    })
}

function productosAgotados(req, res){
    if(req.usuario.rol ==='ADMIN'){
        Productos.find({stock: 0},(err,productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la solicitud'})
        if(!productoEncontrado) return res.status(500).send({mensaje: 'productos no encontrados'})
        return res.status(500).send({mensaje: 'producto agotado', productoEncontrado})
        })
    }else{
        return res.status(500).send({mensaje: 'no posee los permisos necesarios'})
    }
}

function masVendidos(req,res){
    Productos.aggregate([
        {$project:{_id: 1, nombre: 1, precio: 1,cantidadVendida: 1}},
        {$sort: {cantidadVendida: -1}}
    ]) .exec((err, productoEncontrado)=>{
        return res.status(200).send({productoEncontrado})
    })
}
    

module.exports = {
    registroProducto,
    editarProducto,
    elimininarProducto,
    obtenerProductoID,
    obtenerProductoNombre,
    obtenerProductoPorCategoria,
    controlStock,
    productosAgotados,
    masVendidos
}
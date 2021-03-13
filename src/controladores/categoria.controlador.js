'use strict'

const Categoria = require('../modelos/categoria.modelo');
const CategoriaModel = require('../modelos/categoria.modelo');
const jwt = require('../servicios/usuario,jwt');
const usuarioModel = require('../modelos/usuario.modelo');
const controladorUsuario = require('../controladores/usuario.controlador');
const Producto = require('../modelos/productos.modelo');

function registrarCategoriaDefault(req,res){
    var categoriaModel = new Categoria();
    var nombre = 'default';
    var descripcion = 'contiene productos de categorias eliminadas';
        categoriaModel.nombre = nombre;
        categoriaModel.descripcion = descripcion;
        Categoria.find({$or: [
            {nombre: categoriaModel.nombre}
        ]}).exec((err, categoriaEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'});
            if(categoriaEncontrada && categoriaEncontrada.length >=1){
                return console.log('la categoria ya existe');
            }else{
                categoriaModel.save((err, categoriaGuardada)=>{
                    if(err)return console.log('error al guardar la categoria')
                    if(categoriaGuardada){
                        res.status(200).send(categoriaGuardada)
                    }else{
                        console.log('no se ha podido registrar la categoria');
                    }
            })
        }
    })
}

function registrarCategoria(req,res){
    var categoriaModel = new Categoria();
    var params = req.body;
    if(req.usuario.rol !='ADMIN') return res.status(500).send({mensaje: 'no tienes los permisos concebidos'});
    if(params.nombre && params.descripcion){
        categoriaModel.nombre = params.nombre;
        categoriaModel.descripcion = params.descripcion;
        Categoria.find({$or: [
            {nombre: categoriaModel.nombre}
        ]}).exec((err, categoriaEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'});
            if(categoriaEncontrada && categoriaEncontrada.length >=1){
                return res.status(500).send({mensaje: 'la categoria ya existe'});
            }else{
                categoriaModel.save((err, categoriaGuardada)=>{
                    if(categoriaGuardada){
                        res.status(200).send(categoriaGuardada)
                    }else{
                        res.status(404).send({mensaje: 'no se ha podido registrar la categoria'});
                    }
                })
            }
        })
    }
}

function editarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var params = req.body;
    if(req.usuario.rol !='ADMIN'){
        return res.status(500).send({mensaje: 'no tienes los permisos concebidos'});
    }
    Categoria.findByIdAndUpdate(idCategoria, params,{new: true, useFindAndModify: false },(err, categoriaActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'error ne la peticion'});
        if(!categoriaActualizado) return res.status(500).send({mensaje: 'error en la peticion'})
        return res.status(200).send({categoriaActualizado})
    })
    
}

function eliminarCategoria(req, res){   
    const idCategoria = req.params.idCategoria;
    if(req.usuario.rol !='ADMIN'){
        return res.status(500).send({mensaje: 'no tienes los permisos concebidos'});
    }
    Categoria.findOne({nombre: 'default'}, (err,categoriaEncontrada)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
        if(!categoriaEncontrada) return res.status(500).send({mensaje: 'producto no encontrado'})      
    
    Producto.updateMany({idCategoria: idCategoria},{idCategoria: categoriaEncontrada._id},(err,arrowFunction)=>{
    
            Categoria.findByIdAndDelete(idCategoria, (err, categoriaEliminada)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'})
            if(!categoriaEliminada) return res.status(500).send({mensaje: 'error al eliminar categoria'})
            return res.status(200).send({mensaje: 'Categoria eliminada con exito', categoriaEliminada})
        })
    })
    })
}

function obtenerCategorias(req, res){
    Categoria.find((err, categoriaEncontrada)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion de obtener las categorias'})
        if(!categoriaEncontrada) return res.status(500).send({mensaje: ' error en la consulta'});
        return res.status(200).send({categoriaEncontrada});
    })
}

module.exports = {
    registrarCategoriaDefault,
    registrarCategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategorias
}
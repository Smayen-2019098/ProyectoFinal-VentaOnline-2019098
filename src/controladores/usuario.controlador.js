'use strict'

const Usuario = require('../modelos/usuario.modelo');
const bcrypt = require('bcrypt-nodejs');
const usuarioModel = require('../modelos/usuario.modelo');
const jwt = require('../servicios/usuario,jwt');
const carritoControlador = require('../controladores/carrito.controlador');
const Factura = require('../modelos/factura.modelo');


function registroAdmin(req, res){
 var usuarioModel = new Usuario();
 var usuario = 'ADMIN';
 var rol =  "ADMIN";
 var contraseña = '123456'
 usuarioModel.usuario = usuario;
 usuarioModel.rol = rol;
 usuarioModel.contraseña = contraseña;
 Usuario.find({ $or:[
     {usuario: usuarioModel.usuario},
 ]}).exec((err, usuarioEncontrados)=>{
     if(err) return res.status(500).send({mensaje: 'error en la peticion del usuario'})
     if(usuarioEncontrados && usuarioEncontrados.length >= 1){
         return console.log('el usuario ya existe')
     }else{
         bcrypt.hash(contraseña, null, null, (err, contraseñaEncriptada)=>{
             usuarioModel.contraseña = contraseñaEncriptada;
             usuarioModel.save((err, usuarioGuardado)=>{
                if(err) return console.log('error al guardar el usuario')
                if(usuarioGuardado){
                    console.log(usuarioGuardado)                    
                }else{
                    console.log('no se ha podido registrar el usuario')
                }
            })
         })
     }
 })
}

function registrarUsuario(req, res){
    var usuarioModel = new Usuario();
    var params = req.body;
    if(params.nombre && params.usuario  && params.contraseña){
        usuarioModel.nombre = params.nombre;
        usuarioModel.usuario = params.usuario;
        usuarioModel.rol = 'cliente';
        usuarioModel.contraseña = params.contraseña;
        Usuario.find({$or:[
            {usuario: usuarioModel.Usuario},
            {contraseña: usuarioModel.contraseña}
        ]}).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'});
            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                return res.status(500).send({mensaje: 'la empresa ya existe'});
            }else{
                bcrypt.hash(params.contraseña, null, null,(err, contraseñaEncriptada)=>{
                    usuarioModel.contraseña = contraseñaEncriptada;
                    usuarioModel.save((err, usuarioGuardado)=>{
                        if(usuarioGuardado){
                            res.status(200).send(usuarioGuardado)
                        }else{
                            res.status(404).send({mensaje: 'no se ha podido registrar el usuario'});
                        }
                    })
                })
            }
        })
    }
}

function login(req, res){
    var params = req.body;
    Usuario.findOne({usuario: params.usuario},(err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'error en la peticion'})
        if(usuarioEncontrado){
        bcrypt.compare(params.contraseña, usuarioEncontrado.contraseña, (err, contraseñaCorrecta)=>{
            if(contraseñaCorrecta){
                if(params.obtenerToken === 'true'){
                    if(usuarioEncontrado.rol ==="ADMIN"){
                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado)})
                    }else{
                        carritoControlador.crearCarrito(usuarioEncontrado._id);
                        Factura.find({idUsuario: usuarioEncontrado._id}, (err, facturaEncontrada)=>{
                            if(err) return res.status(500).send({mensaje: 'error en la peticion'})
                            if(!usuarioEncontrado) return res.status(500).send({mensaje: 'error en la consulta de facturas'})
                            return res.status(200).send({token: jwt.createToken(usuarioEncontrado),facturaEncontrada})

                        } )                        
                    }
                }else{
                    usuarioEncontrado.contraseña = undefined;

                    return res.status(200).send({usuarioEncontrado})
                }
            }else{
                return res.status(404).send({mensaje: 'el usuario no se ha podido identificar'})
            }
        })
    }else{
        return res.status(404).send({mensaje: 'el usuario no se ha podido encontrar'})
    }
    })

}

function editarUsuario(req, res){
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    delete params.contraseña;       
    if(req.usuario.rol != 'cliente'){
     delete params.rol;   
        Usuario.findByIdAndUpdate(idUsuario, params, {new: true, useFindAndModify: false},(err, usuarioActualizado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'});
            if(!usuarioActualizado) return res.status(500).send({mensaje: 'no se ha podido actualizar el usuario'});
            if(req.usuario.sub != usuarioActualizado._id) return res.status(500).send({mensaje: 'no posee los permisos'});
            return res.status(200).send({usuarioActualizado});
        })
    }else{
        return res.status(500).send({mensaje: 'El administrador no puede realizar la peticion'})
    }if(req.usuario.sub != 'ADMIN'){
        Usuario.findById(idUsuario, (err, usuarioId)=>{
            if(err) return res.status().send({mensaje: 'error en la peticion'});
            if(!usuarioId) return res.status(500).send({mensaje: 'el usuario no se encuentra'})
            if(usuarioId.rol === 'ADMIN') return res.status(500).send({mensaje: 'no puede modificar al administrador'})
            Usuario.findByIdAndUpdate(idUsuario, params, {new: true, useFindAndModify: false},(err, usuarioActualizado)=>{
                if(params.rol != 'Admin' && params.rol !='cliente'){
                    return res.status(500).send({mensaje: 'el rol no es admitido'})
                }
                if(err) res.status(500).send({mensaje: 'error en la peticion'})
                if(!usuarioActualizado) res.status(500).send({mensaje: 'el usuario no es encontrado'})
                if(usuarioActualizado.rol === 'cliente'){
                    return res.status(200).send({usuarioActualizado})
                }
                return res.status(200).send({usuarioActualizado});
            })
        })
    }
}

function eliminarUsuario(req, res){
    const idUsuario = req.params.idUsuario;
    if(req.usuario.rol != 'cliente'){
           Usuario.findByIdAndDelete(idUsuario, {new: true, useFindAndModify: false},(err, usuarioEliminado)=>{
               if(err) return res.status(500).send({mensaje: 'error en la peticion'});
               if(!usuarioEliminado) return res.status(500).send({mensaje: 'no se ha podido elimininar el usuario'});
               if(req.usuario.sub != usuarioEliminado._id) return res.status(500).send({mensaje: 'no posee los permisos'});
               return res.status(200).send({usuarioEliminado});
           })
       }else{
           return res.status(500).send({mensaje: 'El administrador no puede realizar la peticion'})
       }if(req.usuario.sub != 'ADMIN'){
           Usuario.findById(idUsuario, (err, usuarioId)=>{
               if(err) return res.status().send({mensaje: 'error en la peticion'});
               if(!usuarioId) return res.status(500).send({mensaje: 'el usuario no se encuentra'})
               if(usuarioId.rol === 'ADMIN') return res.status(500).send({mensaje: 'no puede eliminar al administrador'})
               Usuario.findByIdAndDelete(idUsuario, {new: true, useFindAndModify: false},(err, usuarioEliminado)=>{
                   if(err) res.status(500).send({mensaje: 'error en la peticion'})
                   if(!usuarioEliminado) res.status(500).send({mensaje: 'el usuario no es encontrado'})
                   if(usuarioEliminado.rol === 'cliente'){
                       return res.status(200).send({usuarioEliminado})
                   }
                   return res.status(200).send({usuarioEliminado});
               })
           })
       }

}

module.exports = {
    registroAdmin,
    login,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario
}


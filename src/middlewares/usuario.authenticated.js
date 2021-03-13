'use strict'
var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'claveAdmin'
    
 exports.ensureAuth = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(400).send({mensaje: 'La peticion no tiene la cabezera de Autorizacion'})
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret)
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ mensaje: 'el token ha expirado'})
        }
    } catch (error) {
        return res.status(404).send({mensaje: 'el token no es valido'})
    }
    req.usuario = payload;
    next();
}
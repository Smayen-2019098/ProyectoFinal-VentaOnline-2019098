'use strict'
var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'claveAdmin'

exports.createToken = function(usuario){
    var payload = {
        sub: usuario._id,
        usuario: usuario.usuario,
        rol: usuario.rol,
        contraseña: usuario.contraseña,
        iat: moment().unix(),
        exp: moment().day(10, 'day').unix()
    }
    return jwt.encode(payload, secret);
}
'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'CLAVE_HOTEL_MANAGEMENT';


exports.ensureAuth = function(req, res, next){
    if (!req.headers.authorization) {
        return res.status(500).send({mensaje: 'La peticion no tiene la cabecera de Autorizacion'});
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                mensaje: 'El Token Expiro'
            });
        }
    }catch (error) {
        return res.status(500).send({
            mensaje: 'El Token no Valido'
        })
    }
    req.user = payload;
    next();
}

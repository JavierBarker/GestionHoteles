'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'CLAVE_HOTEL_MANAGEMENT';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        user: user.user,
        name: user.name,
        role: user.role,
        invoice: [user.invoice],
        iat: moment().unix(),
        exp: moment().day(10,'days').unix()
    }
    return jwt.encode(payload, secret);
}
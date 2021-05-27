'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = Schema({
    clientId:{type: Schema.Types.ObjectId, ref:'Users'},
    hotelId :{type: Schema.Types.ObjectId, ref: 'Hotels'},
    room    :{
        roomId      :{type: String, required: true},
        name        :{type: String, required: true},
        description :{type: String, required: true},
        services    :{type: String, required: true},
        cost        :{type: Number, required: true},
        entryDate   :{type: Date, required: true},
        exitDate    :{type: Date, required: true}
    },
    total   :{type: Number, required: true},
    cancel  :{type: Boolean, required: true}
})

module.exports = mongoose.model('Reservations', ReservationSchema);
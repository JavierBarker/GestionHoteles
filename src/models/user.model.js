'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    user      :{type: String, required: true},
    name      :{type: String, required: true},
    password  :{type: String, required: true},
    role      :{type: String, required: true},
    invoice  :[{
        customerId  :{type: String, required: true},
        hotelId     :{type: String, required: true},
        room        :{
            roomId      :{type: String, required: true},
            name        :{type: String, required: true},
            description :{type: String, required: true},
            services    :{type: String, required: true},
            cost        :{type: Number, required: true},
            entryDate   :{type: Date, required: true},
            exitDate    :{type: Date, required: true}
        },
        total           :{type: Number, required: true},
        daysElapsed     :{type: Number, required: true},
        extraServices   :{type: Number, required: true}
    }]
})

module.exports = mongoose.model('Users', UserSchema);
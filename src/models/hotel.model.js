'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HotelSchema = Schema({
    requests        :{type: Number, required: true},
    name            :{type: String, required: true},
    address         :{type: String, required: true},
    administratorId :{type: Schema.Types.ObjectId, ref: 'Users'},
    image           :{type: String, required: true},
    rooms:[{
        nameRoom        :{type: String, required: true},
        descriptionRoom :{type: String, required: true},
        services        :{type: String, required: true},
        cost            :{type: Number, required: true},
        imageRoom       :{type: String, required: true}
    }],
    events:[{
        nameEvent       :{type: String, required: true},
        descriptionEvent:{type: String, required: true},
        typeEvent       :{type: String, required: true}
    }]
})

module.exports = mongoose.model('Hotels', HotelSchema);
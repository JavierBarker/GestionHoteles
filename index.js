'use strict'

const mongoose = require('mongoose');
const app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/GestionHoteles', {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
    console.log('Se conecto a la base de datos');
    app.listen(3000, function(){
        console.log('El servidor esta conectado en el puerto: 3000')
    })

}).catch(err => console.log(err))
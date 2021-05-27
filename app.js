'use strict'

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const userController = require('./src/controllers/user.controller');

//IMPORTAR RUTAS
const user_route = require('./src/routes/user.routes');
const hotel_route = require('./src/routes/hotel.routes');
const reservation_route = require('./src/routes/reservation.routes');


//INICIAR EL ADMINISTRADOR DE LA APLICACION
userController.registerAdmin();

//MIDDLEWARES 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CABECERAS
app.use(cors());


//CARGAR RUTAS  
app.use('/api', user_route, hotel_route, reservation_route);

//EXPORTAR
module.exports = app;

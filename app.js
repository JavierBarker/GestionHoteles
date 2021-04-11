'use strict'

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

//IMPORTAR RUTAS


//MIDDLEWARES 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CABECERAS
app.use(cors());


//CARGAR RUTAS


//EXPORTAR
module.exports = app;

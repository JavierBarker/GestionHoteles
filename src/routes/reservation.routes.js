'use strict'
const express = require('express');
const reservationController = require('../controllers/reservation.controller');

var md_authenticator = require('../middlewares/authenticated');
var api = express.Router();

api.post('/reserveRoom/:hotelId/:roomId', md_authenticator.ensureAuth, reservationController.reserveRoom);

api.get('/showMyReservations', md_authenticator.ensureAuth, reservationController.showMyReservations);

//api.post('/datesAvailable', reservationController.datesAvailable);
module.exports = api;
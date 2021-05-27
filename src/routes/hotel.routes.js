'use strict'
const express = require('express');
const hotelController = require('../controllers/hotel.controller');

var md_authenticator = require('../middlewares/authenticated');
var api = express.Router();


api.post('/addHotel', md_authenticator.ensureAuth, hotelController.addHotel);

api.put('/updateHotel/:hotelId', md_authenticator.ensureAuth, hotelController.updateHotel);

api.delete('/deleteHotel/:hotelId', md_authenticator.ensureAuth, hotelController.deleteHotel);

api.get('/showHotels', md_authenticator.ensureAuth, hotelController.showHotels);

api.post('/serchHotelNameAddres', hotelController.serchHotelNameAddres);

api.put('/addRoom/:hotelId', md_authenticator.ensureAuth, hotelController.addRoom);

api.put('/addEvent/:hotelId', md_authenticator.ensureAuth, hotelController.addEvent);

api.get('/mostRequestedHotels', hotelController.mostRequestedHotels);

api.get('/mostRequestedHotel', md_authenticator.ensureAuth, hotelController.mostRequestedHotel);

api.get('/serchHotelById/:hotelId', md_authenticator.ensureAuth, hotelController.serchHotelById);

module.exports = api;
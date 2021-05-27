'use strict'
const express = require('express');
const userController = require('../controllers/user.controller');

var md_authenticator = require('../middlewares/authenticated');
var api = express.Router();

api.post('/login', userController.login);

api.get('/serchUserById', md_authenticator.ensureAuth, userController.serchUserById);

api.put('/updateUser', md_authenticator.ensureAuth, userController.updateUser);

api.delete('/deleteUser', md_authenticator.ensureAuth, userController.deleteUser);

api.get('/showRegisteredUsers', md_authenticator.ensureAuth, userController.showRegisteredUsers);

api.get('/showAdminHotelUsers', md_authenticator.ensureAuth, userController.showAdminHotelUsers)

api.post('/registerHotelAdmin', md_authenticator.ensureAuth, userController.registerHotelAdmin);

api.post('/registerUser', userController.registerUser)
module.exports = api;
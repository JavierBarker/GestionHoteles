'use strict'
const { model } = require('mongoose');
const Hotel = require('../models/hotel.model');
const User = require('../models/user.model');

function addHotel(req, res){
    var params = req.body;
    var modelHotel = new Hotel();

    if (req.user.role === 'ROL_ADMIN_APP') {
        User.findById({_id: params.administratorId}, (err, foundUser)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion de Buscar Usuario'});
            if (foundUser.role === 'ROL_USER') {
                return res.status(500).send({mensaje: 'Este no es un administrador de hotel'});
            }else{
                Hotel.findOne({administratorId: params.administratorId}, (err, foundHotel)=>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion de Buscar Hotel'});
                    if (foundHotel) return res.status(500).send({mensaje: 'Este Administrador ya esta vinculado a un Hotel'});
                    if (!foundHotel) {
                        if (params.name && params.address && params.administratorId && params.image) {
                            modelHotel.requests = 0;
                            modelHotel.name = params.name;
                            modelHotel.address = params.address;
                            modelHotel.administratorId = params.administratorId;
                            modelHotel.image = params.image;
                            modelHotel.rooms = [];
                            modelHotel.events = [];
        
                            Hotel.find({ $or:[
                                {name: modelHotel.name}
                            ]}).exec((err, hotelFound) => {
                                if (err) return res.status(500).send({message: "Error en la Petición Hotel", err});
                                if (hotelFound && hotelFound.length >= 1) {
                                    return res.status(500).send({message: 'El Hotel ya Existe'});
                                }else{
                                    modelHotel.save((err, saveHotel) => {
                                        if (err) return res.status(500).send({message: "Error al guardar el Hotel", err});
                                        if (!saveHotel)return res.status(500).send({message: "No se Registro el Hotel"});
                                        return res.status(200).send({saveHotel});
                                    })
                                }
                            })   
                        }else{
                            return res.status(500).send({message: 'Rellene los Espacios Necesarios'});
                        }
                    }
                })      
            }
        })
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}

function updateHotel(req, res) {
    var hotelId = req.params.hotelId;
    var params = req.body;
    if (req.user.role === 'ROL_ADMIN_APP') {
        Hotel.find({ $or:[
            {name: params.name}
        ]}).exec((err, hotelFound) => {
            if (err) return res.status(500).send({message: "Error en la Petición Hotel", err});
            if (hotelFound && hotelFound.length >= 1) {
                return res.status(500).send({message: 'El Hotel ya Existe'});
            }else{
                Hotel.findByIdAndUpdate(hotelId, params, {new: true, useFindAndModify: false}, (err, updateHotel) => {
                    if (err) return res.status(500).send({message: "Error al Actualizar", err});
                    if (!updateHotel)return res.status(500).send({message: "No se Actualizó el Hotel"});
                    return res.status(200).send({updateHotel});
                })
            }
        })
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}

function deleteHotel(req, res) {
    var hotelId = req.params.hotelId;
    if (req.user.role === 'ROL_ADMIN_APP') {
        Hotel.findByIdAndRemove(hotelId, (err, deleteHotel) => {
            if (err) return res.status(500).send({message: "Error al Eliminar", err});
            if (!deleteHotel)return res.status(500).send({message: "No se Eliminó el Hotel"});
            return res.status(200).send({deleteHotel});
        })
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}

function showHotels(req, res){
    if (req.user.role) {
        Hotel.find((err, foundHotels) =>{
            if (err) return res.status(500).send({message: "Error en la peticion Buscar Hoteles"});
            if (!foundHotels)return res.status(500).send({message: "Error al buscar"});
            return res.status(200).send({foundHotels});
        })
    }else{
        return res.status(500).send({message: 'No esta registrado'});
    }
}

function serchHotelNameAddres(req, res){
    var params = req.body;
    Hotel.aggregate([
        {$match: {name:{$regex: params.name, $options: 'i'}}},
        {$match: {address:{$regex: params.address, $options: 'i'}}}
    ]).exec((err, foundHotel)=>{
        return res.status(200).send({foundHotel});
    })
}

function serchHotelById(req, res) {
    var hotelId = req.params.hotelId;
    if (req.user.role === 'ROL_ADMIN_APP') {
        Hotel.findById(hotelId, (err, foundHotel) => {
            if (err) return res.status(500).send({ message: "Error en la peticion Buscar", err });
            if (!foundHotel) return res.status(500).send({ message: "No se encontro el Hotel", addedRoom });
            return res.status(200).send({ foundHotel });
        })
    }
    
}

function addRoom(req, res){
    var hotelId = req.params.hotelId;
    var params = req.body;
    if (req.user.role === 'ROL_ADMIN_APP') {
        if (params.nameRoom && params.descriptionRoom && params.services && params.cost && params.imageRoom) {
            Hotel.findOne({_id: hotelId, "rooms.nameRoom": params.nameRoom}, (err, foundRoom) =>{
                if (err) return res.status(500).send({message: "Error al buscar la Habitacion", err});
                if (foundRoom == null){
                    Hotel.findByIdAndUpdate(hotelId, {$push: {rooms: {nameRoom: params.nameRoom, descriptionRoom: params.descriptionRoom, services: params.services, cost: params.cost, imageRoom: params.imageRoom}}},
                    {new: true, useFindAndModify: false}, (err, addedRoom) =>{
                        
                        if (err) return res.status(500).send({message: "Error al guardar La habitación", err});
                        if (!addedRoom)return res.status(500).send({message: "No se Guardo la habitacion", addedRoom});
                        return res.status(200).send({addedRoom});
                    })
                    
                }else{
                    return res.status(500).send({message: "La habitacion ya existe"});
                }
            })
        }else{
            return res.status(500).send({message: 'Rellene los Espacios Necesarios'});
        }
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}

function addEvent(req, res){
    var hotelId = req.params.hotelId;
    var params = req.body;
    if (req.user.role === 'ROL_ADMIN_APP') {
        if (params.nameEvent && params.descriptionEvent && params.typeEvent) {
            Hotel.findOne({_id: hotelId, "events.nameEvent": params.nameEvent}, (err, foundEvent) =>{
                if (err) return res.status(500).send({message: "Error al buscar la Habitacion", err});
                if (foundEvent == null){
                    Hotel.findByIdAndUpdate(hotelId, {$push: {events: {nameEvent: params.nameEvent, descriptionEvent: params.descriptionEvent, typeEvent: params.typeEvent}}},
                    {new: true, useFindAndModify: false}, (err, addedEvent) =>{
                        
                        if (err) return res.status(500).send({message: "Error al guardar el Hotel", err});
                        if (!addedEvent)return res.status(500).send({message: "No se Guardo la habitacion", addedEvent});
                        return res.status(200).send({addedEvent});
                    })
                    
                }else{
                    return res.status(500).send({message: "El Evento ya existe"});
                }
            })
        }else{
            return res.status(500).send({message: 'Rellene los Espacios Necesarios'});
        }
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}

function mostRequestedHotels(req, res) {//hoteles mas solicitados
    Hotel.aggregate([{$sort: {requests: -1}}, {$limit: 5}]).exec((err, mostRequestedHotels) =>{
        if (err) return res.status(500).send({message: "Error en la Petición", err});
        if (!mostRequestedHotels)return res.status(500).send({message: "Error al buscar"});
        return res.status(200).send({mostRequestedHotels});
    })
}

function mostRequestedHotel(req, res) {//hotel mas solicitado
    if (req.user.role === 'ROL_ADMIN_APP') {
        Hotel.aggregate([{$sort: {requests: -1}}, {$limit: 1}]).exec((err, mostRequestedHotels) =>{
            if (err) return res.status(500).send({message: "Error en la Petición", err});
            if (!mostRequestedHotels)return res.status(500).send({message: "Error al buscar"});
            return res.status(200).send({mostRequestedHotels});
        })
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}



module.exports = { 
    addHotel,
    updateHotel,
    deleteHotel,

    showHotels,
    serchHotelNameAddres,

    addRoom,
    addEvent,
    mostRequestedHotels,
    mostRequestedHotel,
    serchHotelById
}

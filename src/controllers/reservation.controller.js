'use strict'

const Reservation = require('../models/reservation.model'); 
const Hotel = require('../models/hotel.model');


function reserveRoom(req, res){
    var hotelId = req.params.hotelId;
    var roomId = req.params.roomId;
    var params = req.body;
    var modelReservation = new Reservation();
    if(req.user.role === 'ROL_USER'){
        if (params.entryDate && params.exitDate) {
            var entryDate = new Date(params.entryDate);
            var exitDate = new Date(params.exitDate);
            Reservation.find((err, foundReservations) =>{
                
                for (let index = 0; index < foundReservations.length; index++) {
                    if (entryDate.getTime() < foundReservations[index].room.entryDate.getTime() || entryDate.getTime() > foundReservations[index].room.exitDate) {
                        if(exitDate.getTime() < foundReservations[index].room.entryDate.getTime() || entryDate.getTime() > foundReservations[index].room.exitDate){
                            Hotel.findOne({_id: hotelId, "rooms._id": roomId}, {"rooms.$": 1}, (err, foundRoom)=>{
                
                                modelReservation.clientId = req.user.sub;
                                modelReservation.hotelId = hotelId;
                                modelReservation.room = {
                                    roomId: roomId,
                                    name: foundRoom.rooms[0].nameRoom,
                                    description: foundRoom.rooms[0].descriptionRoom,
                                    services: foundRoom.rooms[0].services,
                                    cost: foundRoom.rooms[0].cost,
                                    entryDate: params.entryDate,
                                    exitDate: params.exitDate
                                };
                                modelReservation.total = foundRoom.rooms[0].cost;
                                modelReservation.cancel = false;
                                
                                modelReservation.save((err, savedReservation) => {
                                    if (err) return res.status(500).send({message: "Error al hacer la reservacion", err});
                                    if (!savedReservation)return res.status(500).send({message: "No se hizo la reservacion"});
                                    return res.status(200).send({savedReservation});
                                })
                            })
                        }
                    }else{
                        return res.status(500).send({message: "esta fehca esta en uso"});
                    }
                }
            })
        }else{
        return res.status(500).send({message: 'Rellene los Espacios Necesarios'});
        }
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}

//FECHAS DISCPONIBLES
/*function datesAvailable(entryDate = Date, exitDate = Date) {
    Reservation.find((err, foundReservations) =>{
        /*var lol = foundReservations[0].room.entryDate;
        return res.status(200).send({lol});
        for (let index = 0; index < foundReservations.length; index++) {
            if (entryDate.getTime() < foundReservations[index].room.entryDate.getTime() || entryDate.getTime() > foundReservations[index].room.exitDate) {
                if(exitDate.getTime() < foundReservations[index].room.entryDate.getTime() || entryDate.getTime() > foundReservations[index].room.exitDate){
                    next();
                }
            }
        }
    })
}*/

module.exports = {
    reserveRoom
}
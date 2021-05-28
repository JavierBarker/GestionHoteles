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
            Reservation.find({"room.roomId": roomId}, (err, foundReservations)=>{
                //return res.status(200).send({foundReservations});
                var entryDate = new Date(params.entryDate);
                var exitDate = new Date(params.exitDate);
                
                for (let index = 0; index < foundReservations.length; index++) {
                    if (entryDate.getTime() >= foundReservations[index].room.entryDate.getTime() && entryDate.getTime() <= foundReservations[index].room.exitDate.getTime()) {
                        return res.status(500).send({message: "esta fecha de entrada no esta disponible"});
                    }
                    
                }
                for (let index = 0; index < foundReservations.length; index++) {
                    if (exitDate.getTime() >= foundReservations[index].room.entryDate.getTime() && exitDate.getTime() <= foundReservations[index].room.exitDate.getTime()) {
                        return res.status(500).send({message: "esta fecha de salida no esta disponible"});
                    }
                    
                }
                Hotel.findOne({_id: hotelId, "rooms._id": roomId}, {"rooms.$": 1}, (err, foundRoom)=>{
                    modelReservation.clientId = req.user.sub;
                    modelReservation.hotelId = hotelId;
                    modelReservation.room = {
                        roomId: roomId,
                        name: foundRoom.rooms[0].nameRoom,
                        description: foundRoom.rooms[0].descriptionRoom,
                        services: foundRoom.rooms[0].services,
                        cost: foundRoom.rooms[0].cost,
                        entryDate: entryDate,
                        exitDate: exitDate
                    };
                    modelReservation.total = foundRoom.rooms[0].cost;
                    modelReservation.cancel = false;
                    Hotel.findByIdAndUpdate(hotelId, {$inc:{requests: 1}},{new: true, useFindAndModify: false},(err, incRequest)=>{
                        modelReservation.save((err, savedReservation) => {
                            if (err) return res.status(500).send({message: "Error al hacer la reservacion", err});
                            if (!savedReservation)return res.status(500).send({message: "No se hizo la reservacion"});
                            return res.status(200).send({savedReservation});
                        })
                    })
                })
            })
            /**/
        }else{
        return res.status(500).send({message: 'Rellene los Espacios Necesarios'});
        }
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}

function showMyReservations(req, res) {
    if (req.user.role === "ROL_USER") {
        Reservation.find({clientId: req.user.sub}).populate('hotelId', 'name address').exec((err, foundReservations)=>{
            if (err) return res.status(500).send({ message: "Error al hacer la Peticion", err });
            if (!foundReservations) return res.status(500).send({ message: "No se Encontraron las Reservaciones" });
            return res.status(200).send({ foundReservations });
        })
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
    reserveRoom,
    showMyReservations
}
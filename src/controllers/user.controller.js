'use strict'
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const jwtUser = require('../servicios/jwt.service');

function registerAdmin(req, res){
    var modelAdmin = new User();
    
    modelAdmin.user = "AdminApp";
    modelAdmin.name = "AdminApp";
    modelAdmin.role = "ROL_ADMIN_APP";
    modelAdmin.invoice = [];

    User.find({ $or:[
        {user: modelAdmin.user},
        {name: modelAdmin.name}
    ]}).exec((err, adminFound) => {
        if (err) return console.log("Error en la Petición Admin", err);
        if (adminFound && adminFound.length >= 1) {
            console.log("El usuario Admin ya Existe");
        }else{
            bcrypt.hash("123456", null, null, (err, encryptedPassword) => {
                modelAdmin.password = encryptedPassword;

                modelAdmin.save((err, saveAdmin) => {
                    if (err) console.log("Error al guardar el Admin");
                    if (saveAdmin){
                        console.log(saveAdmin);
                    }else{
                        console.log("No se Registro el Admin");
                    }
                })
            })
        }
    })
}


function login(req, res){
    var params = req.body;
    User.findOne({user: params.user}, (err, foundUser)=>{
        if (err) return res.status(500).send({message: 'Error el la petición del Usuario'});
        if (foundUser){
            bcrypt.compare(params.password, foundUser.password,(err, passCorrect) =>{
                if (passCorrect) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwtUser.createToken(foundUser)
                        })
                    }else{
                        foundUser.password = undefined;
                        return res.status(200).send({login: foundUser});
                    }
                }else{
                    return res.status(500).send({message: 'Contraseña incorrecta'});
                }
            })
        }else{
            return res.status(500).send({message: 'El Usuario no se Encontro'});
        }
    })
}

function serchUserById(req, res) {
    if (req.user.role) {
        User.findById(req.user.sub, (err, foundUser)=>{
            if (err) return res.status(500).send({message: "Error en la peticion Buscar"});
            if (!foundUser)return res.status(500).send({message: "Error al buscar el Usuario"});
            return res.status(200).send({foundUser});
        })
    }else{
        return res.status(500).send({message: 'No esta registrado'});
    }
}

function updateUser(req, res) {
    var params = req.body;
    if (req.user.role) {
        User.find({ $or:[
            {user: params.user},
            {name: params.name}
        ]}).exec((err, userFound) => {
            if (err) return res.status(500).send({message: "Error en la Petición ", err});
            if (userFound && userFound.length >= 1) {
                return res.status(500).send({message: 'No puede tener los mismos datos que otro Usuario'});
            }else{
                User.findByIdAndUpdate(req.user.sub, params, {new: true, useFindAndModify: false}, (err, updateUser)=>{
                    if (err) return res.status(500).send({message: "Error en la peticion Buscar"});
                    if (!updateUser)return res.status(500).send({message: "Error al buscar el Usuario"});
                    return res.status(200).send({updateUser});
                })
            }
        })
    }else{
        return res.status(500).send({message: 'No esta registrado'});
    }

}

function deleteUser(req, res) {
    if (req.user.role) {
        User.findByIdAndRemove(req.user.sub, (err, deleteUser)=>{
            if (err) return res.status(500).send({message: "Error al Eliminar", err});
            if (!deleteUser)return res.status(500).send({message: "No se Eliminó el Hotel"});
            return res.status(200).send({deleteUser});
        })
    }else{
        return res.status(500).send({message: 'No esta registrado'});
    }
}

//ADMIN APP
function showRegisteredUsers(req, res){
    if (req.user.role === "ROL_ADMIN_APP") {
        User.find({role: 'ROL_USER'}, (err, usersFind) => {
            if (err) return res.status(500).send({mensaje: 'Error en la peticion de Obtener Usuarios'});
            if (!usersFind) return res.status(500).send({mensaje: 'Error buscar Usuarios'});
            return res.status(200).send({usersFind});
        })
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'}); 
    }
}

function showAdminHotelUsers(req, res){
    if (req.user.role === "ROL_ADMIN_APP") {
        User.find({role: 'ROL_ADMIN_HOTEL'}, (err, usersFind) => {
            if (err) return res.status(500).send({mensaje: 'Error en la peticion de Obtener Usuarios'});
            if (!usersFind) return res.status(500).send({mensaje: 'Error buscar Usuarios'});
            return res.status(200).send({usersFind});
        })
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'}); 
    }
}





//ADMIN DEL HOTEL
function registerHotelAdmin(req, res){
    var params = req.body;
    var modelUser = new User();
    
    if (req.user.role === 'ROL_ADMIN_APP') {
        if (params.user && params.name && params.password) {
            modelUser.user = params.user;
            modelUser.name = params.name;
            modelUser.role = "ROL_ADMIN_HOTEL";
            modelUser.invoice = [];

            User.find({ $or:[
                {user: modelUser.user},
                {name: modelUser.name}
            ]}).exec((err, userFound) => {
                if (err) return res.status(500).send({message: "Error en la Petición Usuario", err});
                if (userFound && userFound.length >= 1) {
                    return res.status(500).send({message: 'El usuario del Hotel ya Existe'});
                }else{
                    bcrypt.hash(params.password, null, null, (err, encryptedPassword) => {
                        modelUser.password = encryptedPassword;

                        modelUser.save((err, saveUser) => {
                            
                            if (err) return res.status(500).send({message: "Error al guardar el Usuario del Hotel"});
                            if (saveUser){
                                return res.status(200).send({saveUser});
                            }else{
                                return res.status(500).send({message: "No se Registro el Usuario del Hotel"});
                            }
                        })
                    })
                }
            })   
        }else{
            return res.status(500).send({message: 'Rellene los Espacios Necesarios'});
        }
    }else{
        return res.status(500).send({message: 'No tiene los permisos Necesarios'});
    }
}


//USUARIO NORMAL
function registerUser(req, res){
    var params = req.body;
    var modelUser = new User();
    
    if (params.user && params.name && params.password) {
        modelUser.user = params.user;
        modelUser.name = params.name;
        modelUser.role = "ROL_USER";
        modelUser.invoice = [];

        User.find({ $or:[
            {user: modelUser.user},
            {name: modelUser.name}
        ]}).exec((err, userFound) => {
            if (err) return res.status(500).send({message: "Error en la Petición Usuario", err});
            if (userFound && userFound.length >= 1) {
                return res.status(500).send({message: 'El Usuario ya Existe'});
            }else{
                bcrypt.hash(params.password, null, null, (err, encryptedPassword) => {
                    modelUser.password = encryptedPassword;

                    modelUser.save((err, saveUser) => {
                        
                        if (err) return res.status(500).send({message: "Error al guardar el Usuario"});
                        if (saveUser){
                            return res.status(200).send({saveUser});
                        }else{
                            return res.status(500).send({message: "No se Registro el Usuario"});
                        }
                    })
                })
            }
        })   
    }else{
        return res.status(500).send({message: 'Rellene los Espacios Necesarios'});
    }
}

module.exports = {
    registerAdmin,
    login,
    serchUserById,
    updateUser,
    deleteUser,
    showRegisteredUsers,
    showAdminHotelUsers,
    registerHotelAdmin,
    registerUser

}
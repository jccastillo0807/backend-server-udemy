//Requires
//asignar a una variable la referencia a cada una de las librerias
var express = require('express');


//Inicializar variables
var app = express();

const path = require('path');
const fs = require('fs');


app.get('/:tipoColeccion/:img', (req, res, next) => {
    var tipoColeccion = req.params.tipoColeccion;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipoColeccion}/${img}`);
    var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
    //validacion que permite establecer si ya hay una imagen
    // si no existe coloca una imagen por defecto
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;
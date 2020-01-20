//Requires
//asignar a una variable la referencia a cada una de las librerias
var express = require('express');


//Inicializar variables
var app = express();


app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })
});

module.exports = app;
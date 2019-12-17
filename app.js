//Requires
//asignar a una variable la referencia a cada una de las librerias
var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos:\x1b[32m%s\x1b[0m', ' online');
})

//Escuchar peticiones
app.listen(3001, () => {
    console.log('Express server en el puerto 3001:\x1b[32m%s\x1b[0m', ' online');
})

//rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })
});
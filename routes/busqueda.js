//Requires
//asignar a una variable la referencia a cada una de las librerias
var express = require('express');


//Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//BUSQUEDA POR COLECCION ESPECIFICA
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var parametroBusqueda = req.params.busqueda;
    var parametroTabla = req.params.tabla;
    var expresionRegularBusqueda = new RegExp(parametroBusqueda, 'i');
    var promesa;

    switch (parametroTabla) {
        case 'usuarios':
            promesa = buscarUsuarios(parametroBusqueda, expresionRegularBusqueda);
            break;
        case 'medicos':
            promesa = buscarMedicos(parametroBusqueda, expresionRegularBusqueda);
            break;
        case 'hospitales':
            promesa = buscarHospitales(parametroBusqueda, expresionRegularBusqueda);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuario, medicos, hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [parametroTabla]: data
        });
    });
});


//BUSQUEDA POR TODAS LAS COLECCIONES
app.get('/todo/:busqueda', (req, res, next) => {
    var parametroBusqueda = req.params.busqueda;
    var expresionRegularBusqueda = new RegExp(parametroBusqueda, 'i');
    //permite obtener resultados de varias funciones de busqueda
    Promise.all([buscarHospitales(parametroBusqueda, expresionRegularBusqueda),
        buscarMedicos(parametroBusqueda, expresionRegularBusqueda),
        buscarUsuarios(parametroBusqueda, expresionRegularBusqueda)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
    /*
    manera vieja de obtener resultado de un solo modelo
    buscarHospitales(parametroBusqueda, expresionRegularBusqueda).then(hospitales => {
        res.status(200).json({
            ok: true,
            hospitales: hospitales
        });
    });*/
});

//realizar varias busquedas con procesos asincronos

function buscarHospitales(parametroBusqueda, expresionRegularBusqueda) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: expresionRegularBusqueda })
            .populate('usuario', 'nombre email') //traer campos especifico
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(parametroBusqueda, expresionRegularBusqueda) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: expresionRegularBusqueda })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}


//funcion que permite buscar en dos columnas diferentes
function buscarUsuarios(parametroBusqueda, expresionRegularBusqueda) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role') //traer campos especificos de la coleccion
            .or([{ 'nombre': expresionRegularBusqueda }, { 'email': expresionRegularBusqueda }]) //realizar busqueda por dos campos diferentes
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios ', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;
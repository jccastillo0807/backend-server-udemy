//Requires
//asignar a una variable la referencia a cada una de las librerias
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');


//Inicializar variables
var app = express();

//importar models
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipoColeccion/:id', (req, res, next) => {

    //obtener parametros enviados por url y asignarlos a variables
    var tipoColeccion = req.params.tipoColeccion;
    var id = req.params.id;

    //validacion para que sea de un tipo de coleccion en especifico
    var tipoValidosColeccion = ['hospitales', 'medicos', 'usuarios'];
    if (tipoValidosColeccion.indexOf(tipoColeccion) < 0) { //.indexOf: permite comparar los dos arreglos, retornando -1 si no coincide alguno de los elementos
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección nó válida',
            errors: { message: 'Tipo de colección nó válida' } //.join permite mostrar todos los valores del arreglo
        });
    }



    //validacion que permite establecer si se ha seleccionado un archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó algun archivo',
            errors: { message: 'Debe seleccionar un archivo' }
        });
    }

    //obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.'); //permite obtener la extension del archivo
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]; //asigna la extension del archivo a la variable


    //validacion que limita las extensiones de archivos permitidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) { //.indexOf: permite comparar los dos arreglos, retornando -1 si no coincide alguno de los elementos
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión nó válida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') } //.join permite mostrar todos los valores del arreglo
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //mover el archivo del temporal a una ruta
    var path = `./uploads/${tipoColeccion}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipoColeccion, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Peticion realizada correctamente',
        //     extensionArchivo: extensionArchivo
        // });
    });
});

function subirPorTipo(tipoColeccion, id, nombreArchivo, res) {
    if (tipoColeccion === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            //validacion del usuario
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathAntiguoImagen = './uploads/usuarios/' + usuario.img;
            //si existe elimina la imagen anterior
            if (fs.existsSync(pathAntiguoImagen)) {
                fs.unlinkSync(pathAntiguoImagen);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });
    }
    if (tipoColeccion === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }
            var pathAntiguoImagen = './uploads/medicos/' + medico.img;
            //si existe elimina la imagen anterior
            if (fs.existsSync(pathAntiguoImagen)) {
                fs.unlinkSync(pathAntiguoImagen);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipoColeccion === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathAntiguoImagen = './uploads/hospitales/' + hospital.img;
            //si existe elimina la imagen anterior
            if (fs.existsSync(pathAntiguoImagen)) {
                fs.unlinkSync(pathAntiguoImagen);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });

        });
    }
}

module.exports = app;
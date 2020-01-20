var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un valor permitido'
}

var Schema = mongoose.Schema;
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'Nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'Correo es obligatorio'] },
    password: { type: String, required: [true, 'Contraseña es obligatorio'] },
    img: { type: String, required: [false] },
    role: { type: String, required: [true], default: 'USER_ROLE', enum: rolesValidos }
});
usuarioSchema.plugin(uniqueValidator, { message: 'El correo debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Digite um email válido!'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Digite um email válido']
  },
  password: {
    type: String,
    required: [true, 'Digite uma senha válida!'],
    maxLength: [10, 'Digite uma senha com o mínimo de 10 caracteres']
  },
  role: {
    type: String,
    required: [true, 'Digite uma credencial válida!'],
    validate: {
      validator: validateRole,
      message: 'Digite uma credencial válida!'
    }
  }
});

function validateRole(value) {
  const allowedRoles = ['administrador', 'funcionario'];
  return allowedRoles.includes(value);
}

const User = mongoose.model('User', userSchema);

module.exports = User;

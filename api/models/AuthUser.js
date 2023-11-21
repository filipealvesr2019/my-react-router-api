const mongoose = require('mongoose');
const { isEmail, isPassword } = require('validator');

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
    maxLength: [isPassword, 10, 'Digite uma senha com o mínimo de 10 caracteres']
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


// enviar uma função depois do documento no banco de dados ser salvo
userSchema.post('save', function (doc, next) {
  console.log('Usuario criado com sucesso e salvo no banco de dados!', doc);
  next();
})

// enviar uma função antes do documento no banco de dados ser salvo
userSchema.pre('save', function (next){
  console.log("usuario prestes a ser criado e salvo", this)
  next();

});
const User = mongoose.model('User', userSchema);

module.exports = User;

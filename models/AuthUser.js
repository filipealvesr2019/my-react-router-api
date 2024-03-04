const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Digite um email válido!"],
    lowercase: true,
    unique:true,
    validate: [isEmail, "Digite um email válido"],
  },
  password: {
    type: String,
    required: [true, "Digite uma senha"],
    minLength: [10, "Digite uma senha de no mínimo 10 caracteres"],
    select: false,
},
  role: {
    type: String,
    required: [true, "Digite uma credencial válida!"],
    validate: {
      validator: validateRole,
      message: "Digite uma credencial válida!",
    },
  }
});

function validateRole(value) {
  const allowedRoles = ["administrador","Gerente", "funcionario", "customer"];
  return allowedRoles.includes(value);
}
userSchema.methods.comparePassword = async function (gotPassword){
  return await bcrypt.compare(gotPassword, this.password)
}


// criptografando a senha antes de salva o email e senha do usuario
userSchema.pre('save', async function(next){
  if(!this.isModified("password")){
      next()
  }

  this.password = await bcrypt.hash(this.password, 10)
})

// JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
      expiresIn:process.env.JWT_DURATION
  });
}
const User = mongoose.model("User", userSchema);

module.exports = User;

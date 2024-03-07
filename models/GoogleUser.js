const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { isEmail } = require("validator");

// Define o schema do usuário autenticado pelo Google
const googleUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Digite um email válido!"],
    lowercase: true,
    unique:true,
    validate: [isEmail, "Digite um email válido"],
  },
  role: {
    type: String,
    default: 'customer' // Define 'customer' como valor padrão
  }
});

googleUserSchema.methods.getJwtToken = function () {
  return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
      expiresIn:process.env.JWT_DURATION
  });
}

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

module.exports = GoogleUser;

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'funcionario'], // O papel deve ser "admin" ou "funcionario"
    required: true
  }
});



const User = mongoose.model('User', userSchema);

module.exports = User;

// models/account.js

const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: String,
  price: Number
  // Adicione outros campos conforme necessário para representar uma conta
});

module.exports = mongoose.model('Account', accountSchema);

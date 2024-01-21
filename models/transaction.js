// models/movement.js

const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  type: String, // 'income' or 'expense'
  month: String, // 'YYYY-MM'
});

module.exports = mongoose.model('Movement', movementSchema);

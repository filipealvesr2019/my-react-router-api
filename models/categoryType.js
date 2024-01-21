// models/category.js

const mongoose = require('mongoose');

const categoryTypeSchema = new mongoose.Schema({
  name: String,
  // Adicione outros campos conforme necessário para representar uma categoria
});

module.exports = mongoose.model('CategoryType', categoryTypeSchema);

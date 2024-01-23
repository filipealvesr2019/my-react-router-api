
const mongoose = require('mongoose');

const categoryTypeRevenuesSchema = new mongoose.Schema({
  name: String,
  // Adicione outros campos conforme necessário para representar uma categoria
});

module.exports = mongoose.model('CategoryTypeRevenues', categoryTypeRevenuesSchema);
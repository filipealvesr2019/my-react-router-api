const mongoose = require('mongoose');

const subcategoriaSchema = new mongoose.Schema({
  nome: String,
});

const Subcategoria = mongoose.model('Subcategoria', subcategoriaSchema);

module.exports = Subcategoria;

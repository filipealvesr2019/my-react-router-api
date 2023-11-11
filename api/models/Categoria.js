const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nome: String,
  subcategorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' }],
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;

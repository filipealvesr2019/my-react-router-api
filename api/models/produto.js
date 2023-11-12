const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: String,
  fotos: [String],
  tamanho: String,
  cor: String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  subcategoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategoria' },
});

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
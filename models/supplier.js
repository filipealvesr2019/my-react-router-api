// models/vendor.js

const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: String,
  // Adicione outros campos conforme necessário para representar um fornecedor
});

module.exports = mongoose.model('Supplier', supplierSchema);

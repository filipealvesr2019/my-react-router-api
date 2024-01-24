// models/vendor.js

const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductStock' }],
  // Adicione outros campos conforme necessário para representar um fornecedor
});

module.exports = mongoose.model('Vendor', vendorSchema);

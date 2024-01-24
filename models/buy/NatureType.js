
const mongoose = require('mongoose');

const natureSchema = new mongoose.Schema({
  name: String  // Adicione outros campos conforme necessário para representar um fornecedor
});

module.exports = mongoose.model('NatureType', natureSchema);

// models/paymentType.js

const mongoose = require('mongoose');

const paymentTypeSchema = new mongoose.Schema({
  name: String,
  // Adicione outros campos conforme necessário para representar um tipo de pagamento
});

module.exports = mongoose.model('PaymentType', paymentTypeSchema);

const mongoose = require('mongoose');

const saidaSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductStock' },
  quantity: { type: Number },
  date: { type: Date, default: Date.now },
});

const Saida = mongoose.model('Saida', saidaSchema);

module.exports = Saida;

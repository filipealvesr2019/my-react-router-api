const mongoose = require('mongoose');

const entradaSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductStock' },
  quantity: { type: Number },
  date: { type: Date, default: Date.now },
});



const Entrada = mongoose.model('Entrada', entradaSchema);

module.exports = Entrada;

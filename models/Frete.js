const mongoose = require('mongoose');

const freteSchema = new mongoose.Schema({
  valorFrete: {
    type: Number,
  },
  prazoEntrega: {
    type: Number,
  },
  dataPrevistaEntrega: {
    type: Date,
  },
  nomeTransportadora: {
    type: String,
  }
});

const Frete = mongoose.model('Frete', freteSchema);

module.exports = Frete;

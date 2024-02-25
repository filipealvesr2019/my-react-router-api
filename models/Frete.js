const mongoose = require("mongoose");

const freteSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
  },

  valorFrete: {
    type: Number,
  },
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
  },
  logo: {
    type: String,
  },
});

const Frete = mongoose.model("Frete", freteSchema);

module.exports = Frete;

// models/UnitOfMeasure.js
const mongoose = require('mongoose');

const unitOfMeasureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  converter: {
    type: Number,
    required: true,
  },
  conversionOperator: {
    type: String,
    required: true,
    enum: ['Multiplicação', 'Divisão'], // Valores fixos para o operador de conversão
  },
});

const UnitOfMeasure = mongoose.model('UnitOfMeasure', unitOfMeasureSchema);

module.exports = UnitOfMeasure;

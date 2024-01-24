// models/buy.js

const mongoose = require('mongoose');

const buySchema = new mongoose.Schema({
    registrationData: [{
        Nature: { type: mongoose.Schema.Types.ObjectId, ref: 'NatureType' },
        CFOP: Number,
        Number: Number,
        EntryDate: Number,
        Buyer: Number,
        Series: Number,
        Model: Number,
        IssueDate: new Date(),
        conversionOperator: {
            type: String,
            required: true,
            enum: ['Multiplicação', 'Divisão'], // Valores fixos para o operador de conversão
          },
        // Outros campos de produto
      }],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, 
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductStock' },
    quantity: Number,
    unit: Number,
    price: Number,
    total: Number,
    // Outros campos de produto
  }],
  // Adicione outros campos conforme necessário para representar uma compra
});

module.exports = mongoose.model('Buy', buySchema);

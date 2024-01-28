// models/ProductStock.js
const mongoose = require('mongoose');

const productStockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerPiece: {
    type: Number,
    required: true,
  },
  costPerPiece: {
    type: Number,
    required: true,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryStock' }, // Referência ao modelo Category
  
  preferredSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier'},
  unitOfMeasure: { type: mongoose.Schema.Types.ObjectId, ref: 'UnitOfMeasure' },
  minQuantity: {
    type: Number,
  },
  reference: {
    type: String,
  },
  barcode: {
    type: String,
  },
  averageCost: {
    type: Number,
  },
  productType: {
    type: String,
  },
  grossWeight: {
    type: Number,
  },
  netWeight: {
    type: Number,
  },
  grossProfitPerPiece: {
    type: Number,
    default: 0,
  },
  grossProfitPercentage: {
    type: Number,
  },
  totalProfit: Number,
  observations: {
    type: String,
  },
});


// Método para calcular o lucro por porcentagem
productStockSchema.methods.calculateGrossProfitPercentage = function() {
  // Certifique-se de que tanto o preço quanto o custo estão definidos
  if (this.pricePerPiece !== undefined && this.costPerPiece !== undefined) {
    // Calcular o lucro por porcentagem corrigindo a fórmula e arredondando para um número inteiro
    const grossProfitPercentage = Math.round(((this.pricePerPiece - this.costPerPiece) / this.pricePerPiece) * 100);
    // Atribuir o resultado à propriedade grossProfitPercentage
    this.grossProfitPercentage = grossProfitPercentage;
  } else {
    // Se preço ou custo não estão definidos, retornar uma mensagem de erro ou um valor padrão
    return 'Preço ou custo não definidos';
  }
};


// models/ProductStock.js

// ...
// Método para calcular o lucro por peça
productStockSchema.methods.calculateGrossProfitPerPiece = function() {
  // Certifique-se de que tanto o preço quanto o custo estão definidos
  if (this.pricePerPiece !== undefined && this.costPerPiece !== undefined) {
    // Calcular o lucro por peça
    this.grossProfitPerPiece = this.pricePerPiece - this.costPerPiece;
    // Não precisa retornar, pois o valor já foi atribuído
  } else {
    // Se preço ou custo não estão definidos, lidar com isso conforme necessário
    // Pode retornar uma mensagem de erro ou definir o valor padrão
    this.grossProfitPerPiece = 0; // Defina como 0 por padrão, ajuste conforme necessário
  }
};


// Método para calcular o lucro previsto
productStockSchema.methods.calculateExpectedProfit = function() {
  // Certifique-se de que tanto o preço quanto o custo e a quantidade estão definidos
  if (this.pricePerPiece !== undefined && this.costPerPiece !== undefined && this.quantity !== undefined) {
    // Calcular o lucro previsto corrigindo a fórmula
    const expectedProfit = (this.pricePerPiece - this.costPerPiece) * this.quantity;
    // Atribuir o resultado à propriedade totalProfit
    this.totalProfit = expectedProfit;
    return expectedProfit;
  } else {
    // Se preço, custo, quantidade ou porcentagem de lucro não estão definidos, retornar uma mensagem de erro ou um valor padrão
    return 'Preço, custo, quantidade ou porcentagem de lucro não definidos';
  }
};

const ProductStock = mongoose.model('ProductStock', productStockSchema);

module.exports = ProductStock;

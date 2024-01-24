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
  price: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryStock' }, // Referência ao modelo Category
  
  preferredSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor'},
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
  grossProfitPercentage: {
    type: Number,
  },
  observations: {
    type: String,
  },
});

const ProductStock = mongoose.model('ProductStock', productStockSchema);

module.exports = ProductStock;

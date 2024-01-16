// models/discount.js
const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Referência ao modelo de produtos
    required: true,
  },
  percentage: {
    type: Number,
    required: [true, 'Porcentagem de desconto é obrigatória'],
  },
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;

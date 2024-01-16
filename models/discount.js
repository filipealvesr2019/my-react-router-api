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
  discountedProductDetails: {
    type: {
      name: String,
      price: Number,
      description: String,
      variations: [
        {
          color: String,
          urls: [String],
          _id: mongoose.Schema.Types.ObjectId, // Incluir o campo _id para armazenar o ID da variação
        },
      ],
      size: String,
      category: String,
      subcategory: String,
      inStock: Boolean,
      quantity: Number,
      previousPrice: Number,
      _id: mongoose.Schema.Types.ObjectId, // Incluir o campo _id para armazenar o ID do produto
      __v: Number, // Incluir o campo __v para armazenar a versão do documento
    },
    required: true,
  },
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;

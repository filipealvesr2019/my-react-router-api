const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Entre o nome do Produto'],
    trim: true,
    maxLength: [100, 'O Produto não pode exceder 100 palavras'],
  },
  price: {
    type: Number,
    required: [true, 'Digite o preço'],
    maxLength: [5, 'O preço não pode exceder 5 números'],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, 'Digite a descrição'],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  color: {
    type: String,
    required: [true, "Digite a cor do Produto"],
  },
  size: {
    type: String,
    required: [true, "Digite o tamanho do produto"],
  },
  category: String,
  subcategories: [
    {
      type: String, // Mudança: altere para String
      ref: 'Subcategory',
    },
  ],
  inStock: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);

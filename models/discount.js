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
        },
      ],
      size: String,
      category: String,
      subcategory: String,
      inStock: Boolean,
      quantity: Number,
    },
    required: true,
  },
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;

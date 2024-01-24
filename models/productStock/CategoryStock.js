const mongoose = require('mongoose');

const categoryStockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const CategoryStock = mongoose.model('CategoryStock', categoryStockSchema);

module.exports = CategoryStock;

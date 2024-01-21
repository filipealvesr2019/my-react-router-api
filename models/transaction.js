const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
  type: String, // 'income' or 'expense'
});

module.exports = mongoose.model('Transaction', transactionSchema);

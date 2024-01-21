// models/expense.js

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type: { type: String, enum: ['expense'] }, // 'expense'
  month: String, // 'YYYY-MM'
  dueDate: Date, // Vencimento
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // Referência ao modelo Vendor
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Referência ao modelo Account
  description: String, // Descrição
  paidValue: Number, // Valor Pago
  creationDate: { type: Date, default: Date.now }, // Data de Criação
  document: String, // Documento
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryType' }, // Referência ao modelo Category
  totalAmount: Number, // Valor total da despesa
  paymentDate:{ type: Date }, // Data de Pagamento
  paymentType: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentType' }, // Referência ao modelo PaymentType
  periodicity: String, // Periodicidade
});

module.exports = mongoose.model('Expense', expenseSchema);

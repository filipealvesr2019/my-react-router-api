const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type: { type: String, enum: ['expense'] }, // 'expense'
  month: String, // 'YYYY-MM'
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, 
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Referência ao modelo Account
  description: String, // Descrição
  paidValue: Number, // Valor Pago
  creationDate: { type: Date, default: Date.now }, // Data de Criação
  document: String, // Documento
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryType' }, // Referência ao modelo Category
  totalAmount: Number, // Valor total da despesa
  paymentDate: { type: Date }, // Data de Pagamento
  paymentType: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentType' }, // Referência ao modelo PaymentType
  periodicity: String, // Periodicidade
  dueDate: { type: Date }, // Data de Vencimento
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
});

module.exports = mongoose.model('Expense', expenseSchema);

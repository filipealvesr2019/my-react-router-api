const mongoose = require('mongoose');

const revenuesSchema = new mongoose.Schema({
  type: { type: String, enum: ['revenues'] }, // 'expense'
  month: String, // 'YYYY-MM'
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, 
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Referência ao modelo Account
  description: String, // Descrição
  paidValue: Number, // Valor Pago
  creationDate: { type: Date, default: Date.now }, // Data de Criação
  document: String, // Documento
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryTypeRevenues' }, // Referência ao modelo Category
  totalAmount: Number, // Valor total da despesa
  paymentDate: { type: Date }, // Data de Pagamento
  paymentType: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentType' }, // Referência ao modelo PaymentType
  periodicity: String, // Periodicidade
  dueDate: { type: Date }, // Data de Vencimento
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
});

module.exports = mongoose.model('Revenues', revenuesSchema);

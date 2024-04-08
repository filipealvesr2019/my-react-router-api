const mongoose = require('mongoose');

// Defina os esquemas para os subdocumentos
const discountSchema = new mongoose.Schema({
  value: Number,
  limitDate: Date,
  dueDateLimitDays: Number,
  type: String
});

const fineSchema = new mongoose.Schema({
  value: Number,
  type: String
});

const interestSchema = new mongoose.Schema({
  value: Number,
  type: String
});

// Defina o esquema principal
const paymentReportsSchema = new mongoose.Schema({
  object: String,
  id: String,
  dateCreated: Date,
  customer: String,
  paymentLink: String,
  value: Number,
  netValue: Number,
  description: String,
  billingType: String,
  canBePaidAfterDueDate: Boolean,
  status: String,
  dueDate: Date,
  originalDueDate: Date,
  paymentDate: Date,
  clientPaymentDate: Date,
  installmentNumber: Number,
  invoiceUrl: String,
  invoiceNumber: String,
  externalReference: String,
  deleted: Boolean,
  anticipated: Boolean,
  anticipable: Boolean,
  creditDate: Date,
  estimatedCreditDate: Date,
  transactionReceiptUrl: String,
  nossoNumero: String,
  bankSlipUrl: String,
  lastInvoiceViewedDate: Date,
  lastBankSlipViewedDate: Date,
  discount: discountSchema, // Usando o esquema de desconto definido acima
  fine: fineSchema, // Usando o esquema de multa definido acima
  interest: interestSchema, // Usando o esquema de juros definido acima
  postalService: Boolean,
  custody: String,
  refunds: mongoose.Schema.Types.Mixed // Pode conter qualquer tipo de dado
});

const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

const mongoose = require('mongoose');


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
    discount: {
      value: Number,
      limitDate: Date,
      dueDateLimitDays: Number,
      type: String
    },
    fine: {
      value: Number,
      type: String
    },
    interest: {
      value: Number,
      type: String
    },
    postalService: Boolean,
    custody: String,
    refunds: mongoose.Schema.Types.Mixed // Pode conter qualquer tipo de dado
  });
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

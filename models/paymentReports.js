const mongoose = require('mongoose');


const paymentReportsSchema = new mongoose.Schema({
  id: String,
  event: String,
  payment:{
    object: String,
    id: String,
    status: String,
    dateCreated: String,
    subscription: String,
    installment: String,
    paymentLink: String,
    value: Number,
    netValue: Number,
    description: String,
    billingType: String,
    canBePaidAfterDueDate: Boolean,
    status: String,
    dueDate: String,
    originalDueDate: String,
    paymentDate: String,
    clientPaymentDate: String,
    installmentNumber: Number,
    invoiceUrl: String,
    invoiceNumber: String,
    externalReference: String,
    deleted: Boolean,
    anticipated: Boolean,
    anticipable: Boolean,
    creditDate: String,
    estimatedCreditDate: String,
    transactionReceiptUrl: String,
    nossoNumero: String,
    bankSlipUrl: String,
    lastInvoiceViewedDate: String,
    lastBankSlipViewedDate: String,
    discount: {
      value: Number,
      limitDate: String,
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

  },
});
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

const mongoose = require('mongoose');

const paymentReportsSchema = new mongoose.Schema({


    dateCreated: Date,
    customer: String,
    paymentLink: String,
    value: Number,
    netValue: Number,
    originalValue: Number,
    interestValue: Number,
    description: String,
    billingType: String,
    canBePaidAfterDueDate: Boolean,
    pixTransaction: String,
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
    refunds: [String]
  });

const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

const mongoose = require('mongoose');


const paymentReportsSchema = new mongoose.Schema({
  id: String,
  event: String,
  payment:{
    object: String,
    id: String,
    dateCreated: String,
    subscription: String,
    installment: String,
    paymentLink: String,
    dueDate:String,
    originalDueDate:String,
    value: Number,
    netValue: Number,
    originalValue: Number,
    interestValue: String,
    nossoNumero: String,
    externalReference: String,
    billingType: String,
    status: String,
    pixTransaction: String,
    confirmedDate: String,
    paymentDate: String,
    clientPaymentDate: String,
    installmentNumber: String,
    creditDate: String,
    custody: String,
    estimatedCreditDate: String,
    invoiceUrl: String,
    bankSlipUrl: String,
    transactionReceiptUrl: String,
    invoiceNumber: String,
    deleted: String,
    anticipated: String,
    anticipable: String,
    lastInvoiceViewedDate: String,
    lastBankSlipViewedDate: String,
    postalService: String,
    creditCard:{
      creditCardNumber: String,
      creditCardBrand: String,
      creditCardToken: String
    },
    discount:{
      value: Number,
      dueDateLimitDays: Number,
      limitedDate: String,
      type: String
    },
    fine:{
      value: Number,
      type: String
    },
    interest:{
      value: Number,
      type: String
    },
  
    chargeback:{
      status: String,
      reason: String
    },
    refunds: String,

  },
}

);
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

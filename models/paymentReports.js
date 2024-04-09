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

  },
});
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

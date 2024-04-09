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
    
  },
});
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

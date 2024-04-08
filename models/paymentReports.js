const mongoose = require('mongoose');


const paymentReportsSchema = new mongoose.Schema({
  event: String,
  payment:{
    object:String,
    id: String,
    dateCreated: Date,
    customer: String

  }
});
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

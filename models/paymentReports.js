const mongoose = require('mongoose');


const paymentReportsSchema = new mongoose.Schema({
  event: String,
  payment:{
    id: String
  }
});
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

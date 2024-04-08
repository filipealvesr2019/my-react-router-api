const mongoose = require('mongoose');


const paymentReportsSchema = new mongoose.Schema({
    id: String,
  event: String,
  payment:{
    id: String,
    status: String,
    dateCreated: String

  },
});
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

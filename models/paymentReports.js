const mongoose = require('mongoose');


const paymentReportsSchema = new mongoose.Schema({
  event: {type: String},
  payment:{
    id: String
  },
  status: String
});
const PaymentReports = mongoose.model('PaymentReports', paymentReportsSchema);

module.exports = PaymentReports;

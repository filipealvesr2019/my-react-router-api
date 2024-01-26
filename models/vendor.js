// models/vendor.js

const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  TaxpayerIDNumber: String,
  email: String,
  phoneNumber: Number,

});

module.exports = mongoose.model('Vendor', vendorSchema);

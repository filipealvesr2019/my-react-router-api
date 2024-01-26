// models/vendor.js

const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  TaxpayerIDNumber: Number
});

module.exports = mongoose.model('Vendor', vendorSchema);

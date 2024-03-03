const mongoose = require("mongoose");

const creditCardDataSchema = new mongoose.Schema({
  holderName: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  expiryMonth: {
    type: String,
    required: true,
  },
  expiryYear: {
    type: String,
    required: true,
  },
  ccv: {
    type: String,
    required: true,
  }
});

const creditCardData = mongoose.model("creditCardData", creditCardDataSchema);

module.exports = creditCardData;

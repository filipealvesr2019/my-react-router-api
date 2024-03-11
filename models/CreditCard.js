const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  holderName: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  expiryMonth: {
    type: String,
    required: true
  },
  expiryYear: {
    type: String,
    required: true
  },
  ccv: {
    type: String,
    required: true
  }
});

const customerSchema = new mongoose.Schema({
  custumerId: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  billingType: {
    type: String,
    enum: ['BOLETO', 'CREDIT_CARD', 'PIX'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  externalReference: {
    type: String
  },
  invoiceUrl: {
    type: String
  },
  bankSlipUrl: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  creditCard: creditCardSchema
});

const CreditCard = mongoose.model('CreditCard', customerSchema);

module.exports = CreditCard;

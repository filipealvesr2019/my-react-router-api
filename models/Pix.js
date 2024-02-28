const mongoose = require("mongoose");

const pixSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
  },
  customer: {
    type: String,
    required: true

  },
  billingType: {type:String,    enum: ['BOLETO', 'CREDIT_CARD', 'PIX']},
  
  value: { type: Number, required: true },
  externalReference: {
    type: String,
  }, 
  invoiceUrl: {
    type: String,
  },
  bankSlipUrl: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  shippingFee: {
    type: Number,
    required: true,
    default: 0.0
  },
});

const Pix = mongoose.model("Pix", pixSchema);

module.exports = Pix;

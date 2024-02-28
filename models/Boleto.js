const mongoose = require("mongoose");

const boletoSchema = new mongoose.Schema({
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
});

const Boleto = mongoose.model("Boleto", boletoSchema);

module.exports = Boleto;

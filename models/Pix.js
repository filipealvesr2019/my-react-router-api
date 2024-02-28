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
  externalReference: String, 

  dueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Pix = mongoose.model("Pix", pixSchema);

module.exports = Pix;

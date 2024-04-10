const mongoose = require("mongoose");

const boletoSchema = new mongoose.Schema({
  orderId: {
    type: String,
  },
  customerId: {
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
  shippingFeeData: {
    transportadora: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    shippingFeePrice:{
      type: String,
      default: "",
    },
  },
  products: [
    {
      productId: {
        type: String,
        default: "",
      },
      quantity: {
        type: String,
        default: "",
      },
      size: {
        type: String,
        default: "",
      },
      color: {
        type: String,
        default: "",
      },
    },
  ],
});

const Boleto = mongoose.model("Boleto", boletoSchema);

module.exports = Boleto;

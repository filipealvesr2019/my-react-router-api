const mongoose = require("mongoose");
const PaymentReports = require("./paymentReports");

const boletoSchema = new mongoose.Schema({
  orderId: {
    type: String,
  },
  custumerId: {
    type: String,
  },
  customer: {
    type: String,
    required: true,
  },
  billingType: { type: String, enum: ["BOLETO", "CREDIT_CARD", "PIX"] },

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
    default: 0.0,
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
    shippingFeePrice: {
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
      image: {
        // Adicionando o campo de imagem
        type: String,
        default: " ",
      },
    },
  ],
  status: {
    type: String,
    default: "PENDING" // Defina o valor padrão como "PENDENTE" ou outro valor apropriado
  }
});






const Boleto = mongoose.model("Boleto", boletoSchema);


module.exports = Boleto;

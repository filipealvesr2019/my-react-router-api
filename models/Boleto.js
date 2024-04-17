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
  name: {
    type: String,
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
  totalQuantity: {
    type: Number,
    default: 1 // Defina o valor padrão como "PENDENTE" ou outro valor apropriado
  },
  status: {
    type: String,
    default: "PENDING" // Defina o valor padrão como "PENDENTE" ou outro valor apropriado
  }
});




// Middleware para atualizar o totalQuantity antes de salvar
boletoSchema.pre('save', async function(next) {
  try {
    // Calcula a quantidade total com base nos produtos do pedido
    const totalQuantity = this.products.reduce((acc, product) => acc + parseInt(product.quantity || 0), 0);
    // Atualiza o totalQuantity no documento antes de salvar
    this.totalQuantity = totalQuantity;
    next();
  } catch (error) {
    next(error);
  }
});

const Boleto = mongoose.model("Boleto", boletoSchema);


module.exports = Boleto;

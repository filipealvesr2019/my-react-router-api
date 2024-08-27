const mongoose = require("mongoose");
const Product = require("../models/product");

const creditCardWithPaymentLink = new mongoose.Schema({
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
  createdAt: { type: Date, default: Date.now }, // Campo para armazenar a data de criação

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
      name: {
        // Adicionando o campo de imagem
        type: String,
        default: " ",
      },
      price: {
        // Adicionando o campo de imagem
        type: Number,
        
      },
    },
  ],
  totalQuantity: {
    type: Number,
    default: 1 // Defina o valor padrão como "PENDENTE" ou outro valor apropriado
  },
  trackingCode: { type: String },
  status: {
    type: String,
    default: "PENDING" // Defina o valor padrão como "PENDENTE" ou outro valor apropriado
  }
});




// Middleware para atualizar o totalQuantity e nome dos produtos antes de salvar
creditCardWithPaymentLink.pre('save', async function(next) {
  try {
    // Calcula a quantidade total com base nos produtos do pedido
    const totalQuantity = this.products.reduce((acc, product) => acc + parseInt(product.quantity || 0), 0);
    
    // Atualiza o totalQuantity no documento antes de salvar
    this.totalQuantity = totalQuantity;

    // Atualiza o nome dos produtos com base nos IDs antes de salvar
    for (const product of this.products) {
      const foundProduct = await Product.findById(product.productId); // Supondo que o modelo do produto seja "Product"
      if (foundProduct) {
        product.name = foundProduct.name;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});


const Boleto = mongoose.model("CreditCardWithPaymentLink", creditCardWithPaymentLink);


module.exports = Boleto;

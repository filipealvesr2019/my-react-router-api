const mongoose = require("mongoose");
const Product = require("../models/product");

const PixQRcodeSchema = new mongoose.Schema({
  billingType: {
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
  description: {
    type: String,
  },

  value: { type: Number, required: true },
  format: {
    type: String,
    enum: ["ALL", "IMAGE", "PAYLOAD"],
  },
  createdAt: { type: Date, default: Date.now }, // Campo para armazenar a data de criação


  expirationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  allowsMultiplePayments: {
    type: Boolean, // Alterado para Boolean
    required: true,
    default: true, // Padrão definido como true
  },
  externalReference: {
    type: String,
  },
  payload: {
    type: String,
  },
  encodedImage: {
    type: String,
  },
  decodedImage: {
    type: String,
  },
  id: {
    type: String,
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
      image: { // Adicionando o campo de imagem
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
  createdAt: { type: Date, default: Date.now }, // Campo para armazenar a data de criação

  trackingCode: { type: String },
  totalQuantity: {
    type: Number,
    default: 1 // Defina o valor padrão como "PENDENTE" ou outro valor apropriado
  },
  status: {
    type: String,
    default: "PENDING" // Defina o valor padrão como "PENDENTE" ou outro valor apropriado
  },
  stockUpdated: { type: Boolean, default: false } // Novo campo
});


// Middleware para atualizar o totalQuantity antes de salvar
PixQRcodeSchema.pre('save', async function(next) {
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

const PixQRcode = mongoose.model("PixQRcode", PixQRcodeSchema);

module.exports = PixQRcode;

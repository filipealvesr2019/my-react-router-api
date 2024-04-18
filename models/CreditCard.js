const mongoose = require('mongoose');
const Product = require("../models/product");

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
  orderId: {
    type: String,
  },
  custumerId: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  name: {
    type: String,
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
  installmentCount: {
    type: String
  },
  installmentValue: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  creditCard: creditCardSchema,
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
      image: { // Adicionando o campo de imagem
        type: String,
        default: " ",
      },
      name: {
        // Adicionando o campo de imagem
        type: String,
        default: " ",
      },
    },
  ],
  typeOrder: {
    type: String,
  },
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
customerSchema.pre('save', async function(next) {
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
const CreditCard = mongoose.model('CreditCard', customerSchema);

module.exports = CreditCard;

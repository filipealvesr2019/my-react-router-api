const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");
const cartSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 0.0,
      },
      size: {
        type: String,
        default: " ",
      },
      color: {
        type: String,
        default: " ",
      },
      image: {
        // Adicionando o campo de imagem
        type: String,
        default: " ",
      },

      price: {
        // Adicionando o campo de imagem
        type: Number,
      },
      availableQuantity: {
        type: Number,
        default: 0,
      },
      
    },
  ],
  shippingFee: {
    type: Number,
    default: 0,
  },
  transportadora: {
    nome: {
      type: String,
    },
  },
  logo: {
    img: {
      type: String,
    },
  },
  taxPrice: {
    type: Number,
  },
  orderStatus: {
    type: String,
    default: "Processando...",
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  TotalQuantity: {
    type: Number,
  },
});

// Pré-salvamento para atualizar a quantidade disponível do produto no carrinho
cartSchema.pre("save", async function (next) {
  try {
    for (const product of this.products) {
      const productDetails = await Product.findById(product.productId);
      if (productDetails) {
        product.availableQuantity = productDetails.quantity;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

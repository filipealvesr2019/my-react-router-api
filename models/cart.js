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
        type: String,
        default: " ",
      },
      price: {
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
    default: 0, // Definindo o valor padrão como 0
  },
});

// Pré-salvamento para atualizar a quantidade total de produtos no carrinho
cartSchema.pre("save", async function (next) {
  try {
    let totalQuantity = 0;
    for (const product of this.products) {
      totalQuantity += product.quantity;
    }
    this.TotalQuantity = totalQuantity;
    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      image: { // Adicionando o campo de imagem
        type: String,
        default: " ",
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
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

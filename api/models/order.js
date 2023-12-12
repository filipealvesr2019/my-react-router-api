const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const orderSchema = mongoose.Schema({
  shoppingInfo: {  // Corrigido de shopingInfo para shoppingInfo
    country: {
      type: String,
      required: [true, "O país é obrigatório."]
    },
    postalCode: {
      type: String,
      required: [true, "O código postal é obrigatório."]
    },
    city: {
      type: String,
      required: [true, "A cidade é obrigatória."]
    },
    state: {
      type: String,
      required: [true, "O estado é obrigatório."]
    },
    address: {
      type: String,
      required: [true, "O endereço é obrigatório."]
    }
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, "O cliente é obrigatório."]
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
      },
    }
  ],
  paymentInfo: {
    id: {
      type: String,
      default: uuidv4(),
    },
    status: {
      type: String
    }
  },
  paidAt: {
    type: Date
  },
  shippingFee: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processando..."
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Order", orderSchema);

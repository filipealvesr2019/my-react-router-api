const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
 

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, "O cliente é obrigatório."],
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    },
    // Forma de pagamento
    billingType: {type:String,    enum: ['BOLETO', 'CREDIT_CARD', 'PIX'],
    required: true},
    // total a pagar
    value:{type:Number,  required: true},
    dueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: true
    }
  },
  shippingFee: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice:{
    type:Number,
    required:true
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

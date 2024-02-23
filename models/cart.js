const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
 

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, "O cliente é obrigatório."],
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    },
  
    quantity: {
      type: Number,
      required: true
    },
    dueDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
  },

});

module.exports = mongoose.model("Cart", cartSchema);

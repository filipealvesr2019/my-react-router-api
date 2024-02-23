const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

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
    }
  },

 

});

module.exports = mongoose.model("Cart", cartSchema);

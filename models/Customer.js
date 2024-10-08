const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  custumerId:{ type: String,  },
  name: { type: String, },
  cpfCnpj: { type: String,  },
  mobilePhone: { type: String,  },
  email: { type: String },
  postalCode: { type: String,  },
  address: { type: String },
  addressNumber: { type: String, },
  complement: { type: String },
  province: { type: String,  },
  city: { type: String },
  state: { type: String },
  asaasCustomerId: String,  // Nome deve ser exatamente igual
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  createdAt: {
    type: Date,
    default: Date.now()
  }
});



module.exports = mongoose.model("Customer", customerSchema);

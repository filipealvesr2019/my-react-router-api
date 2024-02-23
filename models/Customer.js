const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  clerkUserId:{ type: String,  },
  name: { type: String, },
  cpfCnpj: { type: Number,  },
  mobilePhone: { type: String,  },
  email: { type: String },
  postalCode: { type: String,  },
  address: { type: String },
  addressNumber: { type: String, },
  complement: { type: String },
  province: { type: String,  },
  city: { type: String },
  state: { type: String },
  asaasCustomerId: { type: String },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});



module.exports = mongoose.model("Customer", customerSchema);

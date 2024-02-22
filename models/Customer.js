const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  clerkUserId:{ type: String, required: true },
  name: { type: String, required: true },
  cpfCnpj: { type: Number, required: true },
  mobilePhone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  postalCode: { type: String, required: true },
  address: { type: String, required: true },
  addressNumber: { type: String, required: true },
  complement: { type: String },
  province: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});



module.exports = mongoose.model("Customer", customerSchema);

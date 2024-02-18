const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    clerkUserId:{ type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  postcode: { type: String, required: true },
  address_street: { type: String, required: true },
  address_street_number: { type: String, required: true },
  address_street_complement: { type: String },
  address_street_district: { type: String, required: true },
  address_city: { type: String, required: true },
  address_state: { type: String, required: true },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

module.exports = mongoose.model("Customer", customerSchema);

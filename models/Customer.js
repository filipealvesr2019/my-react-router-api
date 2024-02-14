const mongoose = require("mongoose");
const validator = require("validator");



const Customer = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
        type: String,
        required: [true, "Digite o seu email."],
        unique: true,
        validate: [validator.isEmail, "Digite um endereço de email válido"],
    },
 
    orders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
      ],
    
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
  postcode: { type: String, required: true },
  address_street: { type: String, required: true },
  address_street_number: { type: String, required: true },
  address_street_complement: String,
  address_street_district: { type: String, required: true },
  address_city: { type: String, required: true },
  address_state: { type: String, required: true },
    create: {
        type: Date,
        default: Date.now,
    },
   
 
});

module.exports = mongoose.model("Customer", Customer);

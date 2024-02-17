const mongoose = require("mongoose");
const validator = require("validator");


const Customer = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
     // Outros campos do usuário...
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]

 
   
 
});

module.exports = mongoose.model("Customer", Customer);

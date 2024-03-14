

const mongoose = require("mongoose");

const PixQRcodeSchema = new mongoose.Schema({
  custumerId: {
        type: String,
      },
  customer: {
    type: String,
    required: true

  },
  description: {
    type:String
},
  
  value: { type: Number, required: true },
  format: {
    type: String,
       enum: ['ALL', 'IMAGE', 'PAYLOAD']
  }, 
 
  expirationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  allowsMultiplePayments: {
    type: Boolean, // Alterado para Boolean
    required: true,
    default: true // Padrão definido como true
  },
  externalReference: {
    type: String,
  }, 
  payload: {
    type: String,
  }, 
  encodedImage: {
    type: String,
  }, 
  decodedImage:{
    type: String,
  },
  id: {
    type: String,
  }, 
});

const PixQRcode = mongoose.model("PixQRcode", PixQRcodeSchema);

module.exports = PixQRcode;

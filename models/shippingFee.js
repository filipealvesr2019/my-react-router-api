const mongoose = require("mongoose");

const shippingFeeSchema = mongoose.Schema({
    cepOrigem: {
        type:String
    },
    cepDestino: {
        type: String,
  
    },
    vlrMerc: {
        type: Number,
        required: true
    },
    pesoMerc: {
        type: Number,
        required: true
    },
    
    produtos: [
        {
            peso:  {type: Number},
            altura:  {type: Number},
            largura: {type: Number},
            comprimento: {type: Number},
            tipo: {
                type:String
            },
            valor: {type: Number},
            quantidade: {type: Number}
        }
    ]
});

module.exports = mongoose.model("shippingFee", shippingFeeSchema);

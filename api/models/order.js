const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const orderShema = mongoose.Schema({
    shopingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:String        },
        postalCode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
    },

    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"Product"
            },

        }
    ],
    paymentInfo:{
        id:{
            type: String,
            default: uuidv4(),  // Gera um UUID único
        },
        status:{
            type:String
        }
    },
    paidAt:{
        type:Date
    },

    itemsPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processando..."
    },
    deliverdAt:{
        type:Date
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("Order", orderShema)
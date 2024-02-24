const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number
    }],
    shippingFee: {
        type: Number,
        default: 0.0
      },
      taxPrice:{
        type:Number
      },
      orderStatus: {
        type: String,
        default: "Processando..."
      },
      deliveredAt: {
        type: Date
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    ,
    dueDate: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

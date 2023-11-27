const Order = require("../models/order")
const Product = require("../models/product");

// fazer um novo pedido => /api/v1/order/new
exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo:Date.now(),
        user:req.user_id
    })

    res.send(200).json({
        success:true,
        order
    })

}


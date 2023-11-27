const Order = require("../models/order");
const Product = require("../models/product");

// fazer um novo pedido => /api/v1/order/new
exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shopingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    try {
        const order = await Order.create({
            orderItems,
            shopingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo: {
                id: Date.now().toString(), // Assuming you want to use a timestamp as the payment ID
                status: paymentInfo.status // Assuming status is provided in the request payload
            },
            paidAt: Date.now(), // Set paidAt to the current date and time
            user: req.user_id
        });

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating order'
        });
    }
};

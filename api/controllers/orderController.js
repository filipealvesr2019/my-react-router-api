const Order = require("../models/order");
// fazer um novo pedido => /api/v1/order/new
exports.newOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shopingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo
        } = req.body;

        const order = await Order.create({
            orderItems,
            shopingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo: {
                id: Date.now().toString(),
                status: paymentInfo.status
            },
            paidAt: Date.now(),
            user: req.user_id
        });

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);

        // Check if headers are already sent before sending the response
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Error creating order'
            });
        } else {
            console.error('Headers already sent, unable to send error response.');
        }
    }
};




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


// Obter informações sobre um pedido específico por ID
exports.getSingleOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Verificar se o pedido pertence ao usuário logado
        const order = await Order.findOne({ _id: orderId, user: req.user_id });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter todos os pedidos do usuário logado
exports.getUserOrders = async (req, res) => {
    try {
        // Encontrar todos os pedidos do usuário logado
        const orders = await Order.find({ user: req.user_id });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

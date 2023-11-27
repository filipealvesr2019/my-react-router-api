const Order = require("../models/order");

const User = require("../models/CustumeModel");
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




exports.createOrder = async (req, res) => {
    try {
      const { userId, orderDetails } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const newOrder = new Order({
        user: userId,
        ...orderDetails,
      });
  
      const savedOrder = await newOrder.save();
      res.json(savedOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const Order = require("../models/order");
const Product = require("../models/product");
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
      paymentInfo,
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
        status: paymentInfo.status,
      },
      paidAt: Date.now(),
      user: req.user_id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    // Check if headers are already sent before sending the response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Error creating order",
      });
    } else {
      console.error("Headers already sent, unable to send error response.");
    }
  }
};

// Obter informações sobre um pedido específico por ID
exports.getSingleOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Verificar se o pedido pertence ao usuário logado
    const order = await Order.findOne({ _id: orderId, user: req.user_id });
    

    let totalAmount = 0;


  
        if(order.orderItems && order.orderItems.length > 0){
            order.orderItems.forEach((item) => {
                totalAmount += item.price * item.quantity;
            })
           
        }



    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    res.status(200).json({ success: true,totalAmount, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todos os pedidos do usuário logado
exports.getUserOrders = async (req, res) => {
  try {
    // Encontrar todos os pedidos do usuário logado
    const orders = await Order.find({ user: req.user_id });

    let totalAmount = 0;


    orders.forEach((order) => {
        if(order.orderItems && order.orderItems.length > 0){
            order.orderItems.forEach((item) => {
                totalAmount += item.price * item.quantity;
            })
           
        }

    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// update pedidos de compra

exports.updateOrders = async (req, res) => {
  try {
    // Encontrar todos os pedidos do usuário logado
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Produto enviado"){
      return  res.status(400).json({
        success: false,
        error:"Você já processou esse pedido."
      });
    }

    order.orderStatus = req.body.status,
    order.deliverdAt = Date.now()

    await order.save()

    order.orderItems.forEach(async item => {
      await updateStock(item.product, item.quantity)
    })

    res.status(200).json({
      success: true,
      message:"Produto processado com sucesso."
      
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


async function  updateStock(id, quantity){
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;

  await product.save({validateBeforeSave:false});
}


// Obter informações sobre um pedido específico por ID
exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;  // Corrigido para usar req.params.id


const order = await Order.findById(orderId);

if (!order) {
  return res.status(404).json({ error: "Pedido não encontrado." });
}

try {
  // Tentar excluir o pedido
  await Order.deleteOne({ _id: orderId, user: req.user_id });

  res.status(200).json({ success: true });
} catch (error) {
  // Lidar com erros específicos da operação de exclusão
  res.status(500).json({ error: "Erro ao excluir o pedido." });
}

};



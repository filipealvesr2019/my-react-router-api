const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const {
    createOrder
} = require("../controllers/orderController");


const { isAuthenticatedUser } = require("../middleware/auth")


// Rotas de pedido


// Rota para obter informações sobre um pedido específico por ID
router.get("/order/:orderId", isAuthenticatedUser, orderController.getSingleOrder);

// Rota para obter todos os pedidos do usuário logado
router.get("/orders", isAuthenticatedUser, orderController.getUserOrders);
router.put("/order/:id", isAuthenticatedUser, orderController.updateOrders);
router.delete("/order/:id", isAuthenticatedUser, orderController.deleteOrder);
router.route("/user/:userId/orders").post(isAuthenticatedUser, createOrder);


module.exports = router;

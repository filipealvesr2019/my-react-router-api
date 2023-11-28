const express = require("express");
const router = express.Router();

const userController = require("../controllers/CustumeEcommerce");
const orderController = require("../controllers/orderController");
const {
    newOrder
} = require("../controllers/orderController");


const { isAuthenticatedUser } = require("../middleware/auth")


// Rotas de pedido

router.route("/order/new").post(isAuthenticatedUser, newOrder);

// Rotas de usuário
router.post('/users/create', userController.createUser);
router.get('/users/getAll', userController.getAllUsers);

// Rota para obter informações sobre um pedido específico por ID
router.get("/order/:orderId", isAuthenticatedUser, orderController.getSingleOrder);

// Rota para obter todos os pedidos do usuário logado
router.get("/orders", isAuthenticatedUser, orderController.getUserOrders);
module.exports = router;

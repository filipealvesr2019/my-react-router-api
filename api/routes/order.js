const express = require("express");
const router = express.Router();

const userController = require("../controllers/CustumeEcommerce");
const orderController = require("../controllers/orderController");
const {
    newOrder
} = require("../controllers/orderController");


const { isAuthenticatedUser } = require("../middleware/auth")



router.route("/order/new").post(isAuthenticatedUser, newOrder);
// Rotas de usuário
router.post('/users/create', userController.createUser);
router.get('/users/getAll', userController.getAllUsers);

// Rotas de pedido
router.post('/orders/create', isAuthenticatedUser, orderController.createOrder);
router.route("/order/new").post(isAuthenticatedUser, orderController.createOrder);

module.exports = router;

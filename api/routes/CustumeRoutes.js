const express = require("express");
const router = express.Router();
const userController = require("../controllers/CustumeEcommerce");

// Rota para criar um novo usuário
router.post("/custume", userController.createUser);

// Rota para obter todos os usuários
router.get("/custume", userController.getAllUsers);

module.exports = router;

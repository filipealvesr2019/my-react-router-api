const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const adminAuth = require("../middleware/adminAuth");
const { getUser, updateUser, deleteUser, getUserByUsername, getAllUsers, loginUser, registerUser } = require("../controllers/AuthController");
const { Userlogout } = require("../controllers/AuthController");

// Apply the protect middleware to all routes below this point
router.use(protect);

// Apply adminAuth middleware to restrict access to admin-only routes
router.use(adminAuth);

// All routes below this point require both authentication and admin authorization

router.get("/users", protect, getAllUsers); // Rota para buscar todos os usuários
router.post("/login", loginUser); // Use directly from AuthController

router.post("/user", registerUser); // Use directly from AuthController
router.get("/user/:id", getUser); // Rota para buscar usuário por ID
router.put("/user/:id", updateUser); // Rota para atualizar usuário por ID
router.delete("/user/:id", deleteUser); // Rota para excluir usuário por ID
router.get("/user", getUserByUsername); // Rota para buscar usuário por nome de usuário
router.route("/logout").post(Userlogout);

module.exports = router;

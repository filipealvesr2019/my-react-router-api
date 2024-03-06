const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  deleteUser,
  getUserByUsername,
  getAllUsers,
  loginUser,
  registerUser,
} = require("../controllers/AuthController");
const { Userlogout } = require("../controllers/AuthController");
const { isAuthenticated, isAdmin } = require("../middleware/middlewares.authMiddleware");
const AuthController = require('../controllers/AuthController')
router.get("/users",isAuthenticated, getAllUsers); // Rota para buscar todos os usuários
router.post("/login", loginUser); // Use directly from AuthController

router.post("/user",  registerUser); // Use directly from AuthController
router.get("/user/:id", getUser); // Rota para buscar usuário por ID
router.put("/user/:id", updateUser); // Rota para atualizar usuário por ID
router.delete("/user/:id", deleteUser); // Rota para excluir usuário por ID
router.get("/user", getUserByUsername); // Rota para buscar usuário por nome de usuário
router.route("/logout").post( Userlogout);
router.get('/rota-protegida', isAuthenticated, (req, res) => {
  res.json({ message: 'Você está autenticado!' });
});

// Use o middleware isAdmin nas rotas que deseja proteger
router.get('/admin-only-route',isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: 'Esta rota só pode ser acessada por administradores.' });
});

router.post('/admin-only-route', isAdmin, (req, res) => {
  res.json({ message: 'Esta rota só pode ser acessada por administradores.' });
});

// Outras rotas que não precisam de proteção
router.get('/public-route', (req, res) => {
  res.json({ message: 'Esta rota é pública e pode ser acessada por qualquer usuário.' });
});

router.post('/public-route', (req, res) => {
  res.json({ message: 'Esta rota é pública e pode ser acessada por qualquer usuário.' });
});

router.post("/forgot-password", AuthController.sendPasswordResetEmail);
// Rota para redefinir a senha
router.post('/reset-password',  AuthController.resetPassword);



module.exports = router;

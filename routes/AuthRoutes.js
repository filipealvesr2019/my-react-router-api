const express = require("express");
const router = express.Router();
const postmark = require('postmark');
const validator = require('validator');
const User = require('../models/AuthUser');
const bcrypt = require('bcryptjs'); // Para gerar senhas temporárias
const jwt = require("jsonwebtoken");
const {
  getUser,
  updateUser,
  deleteUser,
  getUserByUsername,
  getAllUsers,
  loginUser,
  registerUser,
  registerCustumer,
  loginCustumer
} = require("../controllers/AuthController");
const { Userlogout } = require("../controllers/AuthController");
const { isAuthenticated, isAdmin } = require("../middleware/middlewares.authMiddleware");
const AuthController = require('../controllers/AuthController')
router.get("/users",isAuthenticated, getAllUsers); // Rota para buscar todos os usuários
router.post("/login", loginUser); // Use directly from AuthController

router.post("/user",  registerUser); // Use directly from AuthController

router.post("/custumer",  registerCustumer); // Use directly from AuthController
router.post("/loginCustumer", loginCustumer); // Use directly from AuthController

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
router.post('/reset-password/:token',  AuthController.resetPassword);





// Função para enviar e-mail usando Postmark
const sendEmail = async (email, token) => {
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

  try {
    const registrationLink = `http://localhost:5173/register/${token}`;

    await client.sendEmail({
      From: "ceo@mediewal.com.br",
      To: email,
      Subject: "Link de registro",
      TextBody: `Clique no seguinte link para se registrar: ${registrationLink}`,
      HtmlBody: `<p>Clique <a href="${registrationLink}">aqui</a> para se registrar.</p>`,
    });

    console.log("E-mail enviado com sucesso");
  } catch (error) {
    console.error("Erro ao enviar e-mail", error);
  }
};

// Rota para solicitar registro
router.post("/register/request", async (req, res) => {
  const { email } = req.body;

  try {
    // Gerar token JWT com duração de 10 minutos
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // Enviar e-mail com o link de registro contendo o token
    await sendEmail(email, token);

    res.status(200).json({ success: true, message: "Link de registro enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao solicitar registro", error);
    res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
});

// Rota para registrar usuário com o token
router.post("/register/:token", async (req, res) => {
  const { token } = req.params;
  const { email, password, role } = req.body;

  try {
    // Verificar se o token é válido
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se o e-mail no token corresponde ao fornecido no corpo da solicitação
    if (decodedToken.email !== email) {
      return res.status(400).json({ success: false, error: "Token inválido para este e-mail." });
    }

    // Aqui você pode adicionar mais validações, se necessário

    // Criar usuário com e-mail e senha fornecidos
    const user = await User.create({
      email,
      password,
      role,
    });

    res.status(201).json({ user, success: true, message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário", error);
    res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
});

module.exports = router;

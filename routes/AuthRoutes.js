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
  loginCustomer
} = require("../controllers/AuthController");
const { Userlogout } = require("../controllers/AuthController");
const { isAuthenticated, isAdmin } = require("../middleware/middlewares.authMiddleware");
const AuthController = require('../controllers/AuthController')
router.get("/users",isAuthenticated, getAllUsers); // Rota para buscar todos os usuários
router.post("/login", loginUser); // Use directly from AuthController

router.post("/user",isAuthenticated, isAdmin,  registerUser); // Use directly from AuthController

router.post("/loginCustumer", loginCustomer); // Use directly from AuthController

router.post("/user",isAuthenticated, isAdmin,  registerUser); // Use directly from AuthController
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
    const registrationLink = `https://mediewal.com.br/register-user/${token}`;

    await client.sendEmail({
      From: process.env.EMAIL_FROM,
      To: email,
      Subject: "Link de registro",
      TextBody: `Clique no seguinte link para se registrar: ${registrationLink}`,
      HtmlBody: `
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: black; padding: 20px;">
          <tr>
            <td align="center">
              <img src="https://i.imgur.com/uf3BdOa.png" alt="Icone da Mediewal" style="width: 200px; max-width: 100%;"/>
            </td>
          </tr>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0" style="padding: 20px; font-family: Arial, sans-serif;">
          <tr>
            <td align="center" style="font-size: 18px; color: #333333; padding-top: 20px;">
              Clique no botão abaixo para se cadastrar.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 20px;">
              <a href="${registrationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Cadastrar-se
              </a>
            </td>
          </tr>
        </table>
      `,
    });

    console.log("E-mail enviado com sucesso");
  } catch (error) {
    console.error("Erro ao enviar e-mail", error);
  }
};
const sendTimeoutEmail = async (email) => {
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
  
  try {
    await client.sendEmail({
      From: process.env.EMAIL_FROM,
      To: email,
      Subject: "Tempo de cadastro expirado",
      TextBody: "O tempo para completar o seu cadastro expirou. Por favor, solicite um novo link de registro."
    });

    console.log("E-mail de tempo expirado enviado com sucesso");
  } catch (error) {
    console.error("Erro ao enviar e-mail de tempo expirado", error);
  }
};

// Rota para solicitar registro
// Rota para solicitar registro
router.post("/register/request", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email já cadastrado. Por favor, use outro email." });
    }

    // Gerar token JWT com duração de 10 minutos
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // Enviar e-mail com o link de registro contendo o token
    await sendEmail(email, token);

    // Criar um novo usuário com status "pending"
    await User.create({ email, status: "pending", registrationTime: new Date() });

    // Agendar verificação após 10 minutos
    setTimeout(async () => {
      const user = await User.findOne({ email });
      if (user && user.status === "pending") {
        // Enviar e-mail avisando que o tempo expirou
        await sendTimeoutEmail(email);
        console.log(`O tempo para o cadastro de ${email} expirou.`);
      }
    }, 1 * 60 * 1000); // 10 minutos

    res.status(200).json({ success: true, message: "Link de registro enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao solicitar registro", error);
    res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
});


router.post("/register-user/:token", async (req, res) => {
  const { token } = req.params;
  const { email, password, role } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.email !== email) {
      return res.status(400).json({ success: false, error: "Token inválido para este e-mail." });
    }

    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\;?-^.!'{:@#$%^&"_([¨¨||/L+,.=)_£0}*|<>])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
      });
    }

    // Atualizar o status para "completed" ao registrar o usuário
    await User.updateOne({ email }, { password, role, status: "completed" });

    res.status(201).json({ success: true, message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário", error);
    res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
});


module.exports = router;

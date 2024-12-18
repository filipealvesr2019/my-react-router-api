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
      Subject: "Complete seu cadastro na Mediewal",
      TextBody: `Olá,\n\nPor favor, clique no link a seguir para completar seu cadastro na Mediewal: ${registrationLink}`,
      HtmlBody:  `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro na Mediewal</title>
      </head>
      <body style="background-color: #f4f4f4; font-family: Arial, sans-serif; padding: 20px;">
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 20px;">
         <tr>
      <td align="center" style="background-color: black; padding: 20px;">
        <img src="https://i.imgur.com/uf3BdOa.png" alt="Icone da Mediewal" style="width: 200px; max-width: 100%;"/>
      </td>
    </tr>

          <tr>
            <td align="center" style="font-size: 18px; color: #333333; padding-top: 20px;">
              Olá, <br> Clique no botão abaixo para completar seu cadastro na Mediewal ou  <a href="${registrationLink}" style="color: #007bff;">clique aqui</a>.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 20px;">
              <a href="${registrationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Completar Cadastro
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 14px; color: #999999; padding-top: 20px;">
              Se você não solicitou este email, ignore esta mensagem.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    });

    console.log("E-mail enviado com sucesso");
  } catch (error) {
    console.error("Erro ao enviar e-mail", error);
  }
};

// Rota para solicitar registro
// Rota para solicitar registro
router.post("/register/request", async (req, res) => {
  const { email } = req.body;

  try {
    // Verifica se o email já está cadastrado
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email já cadastrado. Por favor, use outro email." });
    }

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
router.post("/register-user/:token", async (req, res) => {
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
// Verificação da composição da senha
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\;?-^.!'{:@#$%^&"_([¨¨||/L+,.=)_£0}*|<>`])/;
if (!passwordRegex.test(password)) {
  return res.status(400).json({
    success: false,
    error: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
  });
}
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

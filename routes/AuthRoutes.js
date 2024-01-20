const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken'); // Adicione esta linha

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

// Middleware de autenticação
const authenticateUser = (req, res, next) => {
  // Verifica se há um token JWT no cabeçalho da requisição
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware de autorização para administradores
const authorizeAdmin = (req, res, next) => {
  // Verifica se o usuário tem a função de administrador
  const userId = req.user.id; // Id do usuário obtido do token
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar função de administrador' });
    }

    if (!user || user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    next();
  });
};

// Rotas protegidas
router.get("/users", authenticateUser, authorizeAdmin, getAllUsers);
router.get("/user/:id", authenticateUser, authorizeAdmin, getUser);
router.put("/user/:id", authenticateUser, authorizeAdmin, updateUser);
router.delete("/user/:id", authenticateUser, authorizeAdmin, deleteUser);

// Rotas públicas
router.post("/login", loginUser);
router.post("/user", registerUser);
router.get("/user", getUserByUsername);

// Rota de logout protegida
router.route("/logout").post(authenticateUser, Userlogout);

module.exports = router;

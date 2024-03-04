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
const { isAuthenticatedUser } = require("../middleware/auth");
const { isAuthenticated } = require("../middleware/middlewares.authMiddleware");

const { addUserDataToRequest, checkPermissions } = require("../middleware/middleware");

router.get("/users",isAuthenticated, getAllUsers); // Rota para buscar todos os usuários
router.post("/login", loginUser); // Use directly from AuthController

router.post("/user", addUserDataToRequest, checkPermissions(["administrador"]), registerUser); // Use directly from AuthController
router.get("/user/:id", getUser); // Rota para buscar usuário por ID
router.put("/user/:id",isAuthenticatedUser, updateUser); // Rota para atualizar usuário por ID
router.delete("/user/:id", addUserDataToRequest, checkPermissions(["administrador"]), deleteUser); // Rota para excluir usuário por ID
router.get("/user", getUserByUsername); // Rota para buscar usuário por nome de usuário
router.route("/logout").post( Userlogout);
router.get('/rota-protegida', isAuthenticated, (req, res) => {
  res.json({ message: 'Você está autenticado!' });
});

module.exports = router;

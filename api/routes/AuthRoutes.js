const express = require('express');
const router = express.Router();
const {
  getUser,
  updateUser,
  deleteUser,
  getUserByUsername,
  getAllUsers,
  loginUser,
  registerUser,
} = require('../controllers/AuthController');

router.get('/users', getAllUsers); // Rota para buscar todos os usuários
router.post('/login', loginUser); // Use directly from AuthController
router.post('/user', registerUser); // Use directly from AuthController
router.get('/user/:id', getUser); // Rota para buscar usuário por ID
router.put('/user/:id', updateUser); // Rota para atualizar usuário por ID
router.delete('/user/:id', deleteUser); // Rota para excluir usuário por ID
router.get('/user', getUserByUsername); // Rota para buscar usuário por nome de usuário

module.exports = router;

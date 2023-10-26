const express = require('express');
const router = express.Router();
const { login, createUser, getUser, updateUser, deleteUser, getUserByUsername, getAllUsers } = require('../controllers/AuthController');
router.get('/login', getAllUsers); // Rota para buscar todos os usuários
router.post('/login', login);
router.post('/user', createUser);
router.get('/user:id', getUser); // Rota para buscar usuário por ID
router.put('/user/:id', updateUser); // Rota para atualizar usuário por ID
router.delete('/user/:id', deleteUser); // Rota para excluir usuário por ID
router.get('/user', getUserByUsername); // Rota para buscar usuário por nome de usuário

// admin routes


// employees routes

module.exports = router;

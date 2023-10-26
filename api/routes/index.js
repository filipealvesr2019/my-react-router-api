const express = require('express');
const router = express.Router();
const { login, createUser, getUser, updateUser, deleteUser } = require('../controllers/AuthController');

router.post('/login', login);
router.post('/user', createUser);
router.get('/user/:id', getUser); // Rota para buscar usuário por ID
router.put('/user/:id', updateUser); // Rota para atualizar usuário por ID
router.delete('/user/:id', deleteUser); // Rota para excluir usuário por ID

module.exports = router;

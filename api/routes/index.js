// routes/index.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Rota para login
router.post('/login', AuthController.login);

// Rota para criar usuário
router.post('/createUser', AuthController.createUser);

module.exports = router;

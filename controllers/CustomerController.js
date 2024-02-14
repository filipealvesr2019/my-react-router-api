// Importe as dependências necessárias
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Customer = require('../models/Customer'); // Certifique-se de que o caminho está correto

// Rota para criar um novo usuário
router.post('/signup', async (req, res) => {
  try {
    // Extrair informações do corpo da solicitação
    const {
      firstname,
      lastname,
      email,
      password,
      telephone,
      postcode,
      address_street,
      address_street_number,
      address_street_complement,
      address_street_district,
      address_city,
      address_state
    } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }

    // Criar um hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar um novo usuário
    const newUser = new Customer({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      telephone,
      postcode,
      address_street,
      address_street_number,
      address_street_complement,
      address_street_district,
      address_city,
      address_state
    });

    // Salvar o novo usuário no banco de dados
    await newUser.save();

    // Responder com sucesso
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    // Lidar com erros
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Exportar o roteador
module.exports = router;

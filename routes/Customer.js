// authRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Importe o modelo do Customer


// Rota para criar um novo usuário
router.post('/signup', async (req, res) => {
  try {
    // Extrair dados do corpo da solicitação
    const {
      firstname,
      lastname,
      telephone,
      email,

      postcode,
      address_street,
      address_street_number,
      address_street_complement,
      address_street_district,
      address_city,
      address_state
    } = req.body;

    // Verificar se o usuário já existe pelo email
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado. Faça login ou utilize outro email.' });
    }

  

    // Criar novo usuário
    const newUser = new Customer({
      firstname,
      lastname,
      telephone,
      email,
      postcode,
      address_street,
      address_street_number,
      address_street_complement,
      address_street_district,
      address_city,
      address_state
    });

    // Salvar o novo usuário no banco de dados
    const savedUser = await newUser.save();

    res.status(201).json({ user: savedUser, message: 'Usuário criado com sucesso.' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
  }
});

module.exports = router;

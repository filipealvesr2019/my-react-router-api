// authRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Importe o modelo do Customer
const Product = require('../models/product')
// Rota para criar um novo usuário
const axios = require("axios")


router.post('/signup', async (req, res) => {
  try {
    // Extrair dados do corpo da solicitação
    const {
      clerkUserId,
      name,
      cpfCnpj,
      mobilePhone,
      email,
      postalCode,
      address,
      addressNumber,
      complement,
      province,
      city,
      state,
  
    } = req.body;

    // Verificar se o usuário já existe pelo email
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado. Faça login ou utilize outro email.' });
    }

    // Criar novo usuário
    const newUser = new Customer({
      clerkUserId,
      name,
      cpfCnpj,
      mobilePhone,
      email,
      postalCode,
      address,
      addressNumber,
      complement,
      province,
      city,
      state,
    });

    // Salvar o novo usuário no banco de dados
    const savedUser = await newUser.save();

    // Enviar os dados do cliente para a rota https://sandbox.asaas.com/api/v3/customers com o token de acesso
    const token = process.env.ACCESS_TOKEN;
    const url = 'https://sandbox.asaas.com/api/v3/customers';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        access_token: token
      },
      
      body: JSON.stringify({
        name,
        cpfCnpj,
        mobilePhone,
        email,
        postalCode,
        address,
        addressNumber,
        complement,
        province,
        city,
        state,
      })
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    res.status(201).json({ user: savedUser, message: 'Usuário criado com sucesso.', responseData });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
  }
});











router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ customers });
  } catch (error) {
    console.error('Erro ao pegar clientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao pegar clientes.' });
  }
});


router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao pegar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao pegar usuário.' });
  }
});



router.get('/favorites/:clerkUserId', async (req, res) => {
  try {
    // Extrair ID do usuário do parâmetro da rota
    const { clerkUserId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ clerkUserId });
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Obter os detalhes dos produtos favoritos do usuário
    const favoriteProducts = await Product.find({ _id: { $in: existingUser.favorites } });

    res.status(200).json({ favorites: favoriteProducts });
  } catch (error) {
    console.error('Erro ao visualizar produtos favoritos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao visualizar produtos favoritos.' });
  }
});

router.post('/favorites', async (req, res) => {
  try {
    // Extrair ID do usuário do corpo da solicitação
    const { clerkUserId } = req.body;

    // Extrair ID do produto do corpo da solicitação
    const { productId } = req.body;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ clerkUserId });
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Encontrar o produto pelo ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Verificar se o produto já está nos favoritos do usuário
    const isProductInFavorites = existingUser.favorites.map(favorite => favorite.toString()).includes(productId);
    if (isProductInFavorites) {
      // Remover o produto dos favoritos do usuário
      existingUser.favorites = existingUser.favorites.filter((favProduct) => favProduct.toString() !== productId);
    } else {
      // Adicionar o produto aos favoritos do usuário
      existingUser.favorites.push(product._id);
    }

    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await existingUser.save();

    res.status(200).json({ user: updatedUser, message: 'Produto adicionado/removido dos favoritos com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar/remover produto dos favoritos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao adicionar/remover produto dos favoritos.' });
  }
});


router.delete('/favorites/:clerkUserId/:productId', async (req, res) => {
  try {
    // Extrair ID do usuário e do produto dos parâmetros da solicitação
    const { clerkUserId, productId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ clerkUserId });
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o produto está nos favoritos do usuário
    const isProductInFavorites = existingUser.favorites.map(favorite => favorite.toString()).includes(productId);
    if (!isProductInFavorites) {
      return res.status(400).json({ message: 'Produto não está nos favoritos do usuário.' });
    }

    // Remover o produto dos favoritos do usuário
    existingUser.favorites = existingUser.favorites.filter((id) => id.toString() !== productId);
    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await existingUser.save();

    res.status(200).json({ user: updatedUser, message: 'Produto removido dos favoritos com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover produto dos favoritos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao remover produto dos favoritos.' });
  }
  
});










module.exports = router;

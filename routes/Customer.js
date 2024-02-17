// authRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Importe o modelo do Customer
const Product = require('../models/product')
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












// Rota para visualizar os produtos favoritos do usuário
router.get('/favorites/:userId', async (req, res) => {
  try {
    // Extrair ID do usuário do parâmetro da rota
    const { userId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findById(userId);
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

// Rota para adicionar ou remover um produto dos favoritos do usuário
router.post('/favorites', async (req, res) => {
  try {
    // Extrair ID do usuário do corpo da solicitação
    const { userId } = req.body;

    // Extrair ID do produto do corpo da solicitação
    const { productId } = req.body;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o produto existe pelo ID
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Verificar se o produto já está nos favoritos do usuário
    const isProductInFavorites = existingUser.favorites.includes(productId);

    // Adicionar ou remover o produto dos favoritos do usuário
    if (isProductInFavorites) {
      // Remover o produto dos favoritos do usuário
      existingUser.favorites = existingUser.favorites.filter((id) => id !== productId);
    } else {
      // Adicionar o produto aos favoritos do usuário
      existingUser.favorites.push(productId);
    }

    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await existingUser.save();

    res.status(200).json({ user: updatedUser, message: 'Produto adicionado dos favoritos com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar produto dos favoritos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao adicionar/remover produto dos favoritos.' });
  }
});






// Rota para remover um produto dos favoritos do usuário
router.delete('/favorites/:userId/:productId', async (req, res) => {
  try {
    // Extrair ID do usuário e do produto dos parâmetros da solicitação
    const { userId, productId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o produto existe pelo ID
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
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

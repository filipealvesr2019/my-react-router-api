const express = require('express');
const router = express.Router();


const Cart = require('../models/cart');
const Product = require('../models/product');
const Customer = require('../models/Customer');
// Rota para remover a quantidade do produto do estoque

// Rota para adicionar um produto ao carrinho
// Rota para adicionar um produto ao carrinho
// Rota para adicionar um produto ao carrinho com um clerkUserId
router.post('/add-to-cart', async (req, res) => {
    try {
      const { clerkUserId, productId, quantity } = req.body;
  
      // Encontra o produto no estoque
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado no estoque.' });
      }
  
      // Verifica se há quantidade suficiente no estoque
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Quantidade insuficiente no estoque.' });
      }
  
      // Encontra o cliente associado ao atendente
      const customer = await Customer.findOne({ clerkUserId: clerkUserId });
  
      if (!customer) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }
  
      // Cria um novo carrinho com o produto
      const cart = new Cart({ customer: customer._id, products: [{ productId: productId, quantity: quantity }] });
      await cart.save();
  
      res.status(200).json({ message: 'Carrinho criado com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar carrinho.' });
    }
  });
  
 


// Rota para mostrar todos os carrinhos do cliente
router.get('/show-all-carts/:clerkUserId', async (req, res) => {
    try {
      const clerkUserId = req.params.clerkUserId;
  
      // Encontra o cliente associado ao atendente
      const customer = await Customer.findOne({ clerkUserId: clerkUserId });
  
      if (!customer) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }
  
      // Encontra todos os carrinhos associados ao cliente
      const carts = await Cart.find({ customer: customer._id });
  
      res.status(200).json(carts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao mostrar carrinhos.' });
    }
  });
  














module.exports = router;

// routes/categoryStock.js
const express = require('express');
const router = express.Router();
const CategoryStock = require('../../models/productStock/CategoryStock');

// Rota para obter todas as categorias de produtos
router.get('/categoryProducts', async (req, res) => {
  try {
    const categories = await CategoryStock.find({}, { _id: 0, __v: 0 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar uma nova categoria de produto
router.post('/categoryProducts', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = await CategoryStock.create({ name, description });
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Outras rotas relacionadas à CategoryStock

module.exports = router;

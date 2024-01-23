// routes/category.js

const express = require('express');
const router = express.Router();
const CategoryTypeRevenues = require('../models/categoryTypeRevenues'); // Supondo que você tenha um modelo Category

// Rota para obter todas as categorias
router.get('/CategoryTypeRevenues', async (req, res) => {
  try {
    const categories = await CategoryTypeRevenues.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar uma nova categoria
router.post('/CategoryTypeRevenues', async (req, res) => {
  const category = new CategoryTypeRevenues({
    name: req.body.name, // Substitua com os campos necessários para a categoria
    // Adicione outros campos conforme necessário
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const NatureType = require('../models/buy/NatureType'); 
// Rota para obter todos os fornecedores
router.get('/nature', async (req, res) => {
  try {
    const natures = await NatureType.find();
    res.json(natures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo fornecedor
router.post('/nature', async (req, res) => {
  const natures = new NatureType({
    name: req.body.name
    // Adicione outros campos conforme necessário
  });

  try {
    const newNature= await natures.save();
    res.status(201).json(newNature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

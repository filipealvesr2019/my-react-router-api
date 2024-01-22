
const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplier'); 
// Rota para obter todos os fornecedores
router.get('/supplier', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo fornecedor
router.post('/supplier', async (req, res) => {
  const supplier = new Supplier({
    name: req.body.name, // Substitua com os campos necessários para o fornecedor
    // Adicione outros campos conforme necessário
  });

  try {
    const newSupplier= await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

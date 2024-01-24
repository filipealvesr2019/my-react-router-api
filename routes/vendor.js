
const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor'); 
// Rota para obter todos os fornecedores
router.get('/vendor', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo fornecedor
router.post('/vendor', async (req, res) => {
  const vendor = new Vendor({
    name: req.body.name,
    products: req.body.products // Substitua com os campos necessários para o fornecedor
    // Adicione outros campos conforme necessário
  });

  try {
    const newVendor= await vendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

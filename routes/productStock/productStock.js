// routes/productStock.js
const express = require('express');
const router = express.Router();
const ProductStock = require('../../models/productStock/ProductStock');

// Rota para obter todos os produtos no estoque
router.get('/productStock', async (req, res) => {
  try {
    const products = await ProductStock.find({}, { _id: 0, __v: 0 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar um novo produto no estoque
// Rota para criar um novo produto no estoque
router.post('/productStock', async (req, res) => {
  try {
    const {
      name,
      quantity,
      price,
      cost,
      category,
      preferredSupplier,
      unitOfMeasure,
      minQuantity,
      reference,
      barcode,
      averageCost,
      productType,
      grossWeight,
      netWeight,
      grossProfitPercentage,
      totalProfit,
      observations,
    } = req.body;

    // Criar o produto
    const newProduct = await ProductStock.create({
      name,
      quantity,
      price,
      cost,
      category,
      preferredSupplier,
      unitOfMeasure,
      minQuantity,
      reference,
      barcode,
      averageCost,
      productType,
      grossWeight,
      netWeight,
      grossProfitPercentage,
      totalProfit,
      observations,
    });

    // Chamar os métodos de cálculo
    newProduct.calculateGrossProfitPercentage();
    newProduct.calculateExpectedProfit();

    // Salvar as alterações no banco de dados
    await newProduct.save();

    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Outras rotas relacionadas a ProductStock

module.exports = router;

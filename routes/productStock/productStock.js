// routes/productStock.js
const express = require('express');
const router = express.Router();
const ProductStock = require('../../models/productStock/ProductStock');






// Rota para obter todos os fornecedores com paginação
router.get("/productStock", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Número da página (padrão: 1)
  const limit = parseInt(req.query.limit) || 10; // Tamanho da página (padrão: 10)

  try {
    const skip = (page - 1) * limit;
    const products = await ProductStock.find().skip(skip).limit(limit);
    const totalProducts = await ProductStock.countDocuments();

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.get("/productStock/search", async (req, res) => {
  const searchName = req.query.name;

  try {
    const product = await ProductStock.find({
      name: { $regex: new RegExp(searchName, "i") },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Rota para criar um novo produto no estoque
// Rota para criar um novo produto no estoque
router.post('/productStock', async (req, res) => {
  try {
    const {
      name,
      quantity,
      pricePerPiece,
      costPerPiece,
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
      pricePerPiece,
      costPerPiece,
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
 
    newProduct.calculateGrossProfitPerPiece(); // Adicionando a chamada para o novo método
    newProduct.calculateExpectedProfit();
    newProduct.calculateTotalCost(); // Adicionando a chamada para o novo método

    // Salvar as alterações no banco de dados
    await newProduct.save();

    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Outras rotas relacionadas a ProductStock

module.exports = router;

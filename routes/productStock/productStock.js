// routes/productStock.js
const express = require('express');
const router = express.Router();
const ProductStock = require('../../models/productStock/ProductStock');
const PurchaseOrder = require('../../models/stock/PurchaseOrder');
const SalesOrders = require('../../models/stock/SalesOrders');
const Entrada = require('../../models/Entrada');






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









// Rota para excluir um clientes por ID
router.delete("/productStock/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedVendor = await ProductStock.findByIdAndDelete(productId);

    if (!deletedVendor) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    res.json({ message: "produto excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para editar um clientes por ID
router.put("/productStock/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Verifique se o fornecedor existe
    const existingProduct = await ProductStock.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Atualize os campos do clientes com base nos dados fornecidos no corpo da solicitação
    existingProduct.name = req.body.name;
    existingProduct.quantity = req.body.quantity;
    existingProduct.pricePerPiece = req.body.pricePerPiece;
    existingProduct.costPerPiece = req.body.costPerPiece;
    existingProduct.category = req.body.category;
    existingProduct.preferredSupplier = req.body.preferredSupplier;
    existingProduct.unitOfMeasure = req.body.unitOfMeasure;
    existingProduct.minQuantity = req.body.minQuantity;
    existingProduct.reference = req.body.reference;
    existingProduct.barcode = req.body.barcode;
    existingProduct.grossWeight = req.body.grossWeight;
    existingProduct.netWeight = req.body.netWeight;
    existingProduct.observations = req.body.observations;

    // Verifique se os campos necessários estão definidos
    if (existingProduct.quantity !== undefined && existingProduct.costPerPiece !== undefined) {
      existingProduct.calculateTotalCost();
    } else {
      // Lide com isso conforme necessário, como retornar uma mensagem de erro ou definir um valor padrão
      existingProduct.totalCost = 0;
    }

    
    existingProduct.calculateGrossProfitPercentage();
    existingProduct.calculateGrossProfitPerPiece();
    existingProduct.calculateExpectedProfit();
    existingProduct.calculateTotalCost();
    // Salve as alterações no banco de dados
    const updatedProduct = await existingProduct.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});








// Rota para obter a lista de produtos
router.get('/products/stock', async (req, res) => {
  try {
    const products = await ProductStock.find({}, 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Rota para adicionar uma entrada de produto
router.post('/entrada/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Verifique se quantity é um número válido
    if (isNaN(parseFloat(quantity)) || !isFinite(quantity)) {
      return res.status(400).json({ error: 'A quantidade deve ser um número válido' });
    }

    const product = await ProductStock.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const entrada = new Entrada({
      product: productId,
      quantity: parseFloat(quantity), // Converta para número
    });

    await entrada.save();

    // Atualizar a quantidade no estoque do produto
    product.quantity += parseFloat(quantity);
    await product.save();

    res.json(entrada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para adicionar uma saída de produto
router.post('/saida/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await ProductStock.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Verificar se há quantidade suficiente no estoque
    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
    }

    const saida = new Saida({
      product: productId,
      quantity,
    });

    await saida.save();

    // Atualizar a quantidade no estoque do produto
    product.quantity -= quantity;
    await product.save();

    res.json(saida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter o histórico de estoque de um produto
router.get('/products/:productId/stock-history', async (req, res) => {
  try {
    const { productId } = req.params;

    // Consulte o banco de dados para obter o histórico de estoque do produto com o ID fornecido
    const stockHistory = await Entrada.find({ product: productId }).sort({ date: 'desc' });

    res.json(stockHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


module.exports = router;

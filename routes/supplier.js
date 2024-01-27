
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
    name: req.body.name,
    TaxpayerIDNumber: req.body.TaxpayerIDNumber,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  });

  try {
    const newSupplier= await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});







// Rota para excluir um fornecedor por ID
router.delete("/supplier/:id", async (req, res) => {
  const supplierId = req.params.id;

  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    res.json({ message: "Fornecedor excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para editar um fornecedor por ID
router.put("/supplier/:id", async (req, res) => {
  const supplierId = req.params.id;

  try {
    // Verifique se o fornecedor existe
    const existingSupplier = await Supplier.findById(supplierId);
    if (!existingSupplier) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    // Atualize os campos do fornecedor com base nos dados fornecidos no corpo da solicitação
    // Atualize os campos do fornecedor com base nos dados fornecidos no corpo da solicitação
    existingSupplier.name = req.body.name;
    existingSupplier.TaxpayerIDNumber = req.body.TaxpayerIDNumber;
    existingSupplier.email = req.body.email;
    existingSupplier.phoneNumber = req.body.phoneNumber;
    // Salve as alterações no banco de dados
    const updatedSupplier = await existingSupplier.save();

    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;

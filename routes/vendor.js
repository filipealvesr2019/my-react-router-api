const express = require("express");
const router = express.Router();
const Vendor = require("../models/vendor");
// Rota para obter todos os fornecedores

// Rota para obter todos os fornecedores com paginação
router.get("/vendor", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Número da página (padrão: 1)
  const limit = parseInt(req.query.limit) || 10; // Tamanho da página (padrão: 10)

  try {
    const skip = (page - 1) * limit;
    const vendors = await Vendor.find().skip(skip).limit(limit);
    const totalVendors = await Vendor.countDocuments();

    const totalPages = Math.ceil(totalVendors / limit);

    res.json({
      vendors,
      page,
      totalPages,
      totalVendors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo clientes
router.post("/vendor", async (req, res) => {
  const vendor = new Vendor({
    name: req.body.name,
    TaxpayerIDNumber: req.body.TaxpayerIDNumber,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    // Adicione outros campos conforme necessário
  });

  try {
    const newVendor = await vendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para pesquisar clientes por nome
router.get("/vendor/search", async (req, res) => {
  const searchName = req.query.name;

  try {
    const vendors = await Vendor.find({
      name: { $regex: new RegExp(searchName, "i") },
    });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para excluir um clientes por ID
router.delete("/vendor/:id", async (req, res) => {
  const vendorId = req.params.id;

  try {
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    res.json({ message: "Cliente excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para editar um clientes por ID
router.put("/vendor/:id", async (req, res) => {
  const vendorId = req.params.id;

  try {
    // Verifique se o fornecedor existe
    const existingVendor = await Vendor.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Atualize os campos do clientes com base nos dados fornecidos no corpo da solicitação
    existingVendor.name = req.body.name;
    existingVendor.TaxpayerIDNumber = req.body.TaxpayerIDNumber;
    existingVendor.email = req.body.email;
    existingVendor.phoneNumber = req.body.phoneNumber;
    // Salve as alterações no banco de dados
    const updatedVendor = await existingVendor.save();

    res.json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

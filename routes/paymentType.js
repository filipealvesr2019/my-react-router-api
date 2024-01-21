// routes/paymentType.js

const express = require('express');
const router = express.Router();
const PaymentType = require('../models/paymentType'); // Supondo que você tenha um modelo PaymentType

// Rota para obter todos os tipos de pagamento
router.get('/paymentType', async (req, res) => {
  try {
    const paymentTypes = await PaymentType.find();
    res.json(paymentTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo tipo de pagamento
router.post('/paymentType', async (req, res) => {
  const paymentType = new PaymentType({
    name: req.body.name, // Substitua com os campos necessários para o tipo de pagamento
    // Adicione outros campos conforme necessário
  });

  try {
    const newPaymentType = await paymentType.save();
    res.status(201).json(newPaymentType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

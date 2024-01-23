const express = require('express');
const router = express.Router();
const Revenues = require('../../models/revenues/revenues');




router.get('/revenues', async (req, res) => {
  try {
    // Buscar todas as receitas no banco de dados
    const allRevenues = await Revenues.find();
    
    // Retornar as receitas como resposta
    res.json(allRevenues);
  } catch (error) {
    // Lidar com erros durante o processo
    res.status(500).json({ message: error.message });
  }
});






// Rota para criar uma nova receita
router.post('/revenues', async (req, res) => {
  try {
    // Extrair informações do corpo da requisição
    const {
      type,
      month,
      vendor,
      account,
      description,
      paidValue,
      document,
      category,
      totalAmount,
      paymentDate,
      paymentType,
      periodicity,
      dueDate,
    } = req.body;

    // Criar uma nova instância do modelo de Receitas
    const newRevenue = new Revenues({
      type,
      month,
      vendor,
      account,
      description,
      paidValue,
      document,
      category,
      totalAmount,
      paymentDate,
      paymentType,
      periodicity,
      dueDate,
      status: 'pending', // Definir o status padrão como 'pending'
    });

    // Salvar a nova receita no banco de dados
    const savedRevenue = await newRevenue.save();

    // Retornar a nova receita como resposta
    res.status(201).json(savedRevenue);
  } catch (error) {
    // Lidar com erros durante o processo
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

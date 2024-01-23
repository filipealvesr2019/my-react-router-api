const express = require('express');
const router = express.Router();
const Revenues = require('../models/revenues/revenues');
const Expense = require('../models/expense');

// Rota para obter o total de despesas
router.get('/expenses/total', async (req, res) => {
  try {
    // Buscar o total de despesas
    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: '$totalAmount',  // Agrupa por totalAmount
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Retornar o total de despesas como resposta
    res.json({
      totalExpenses: totalExpenses.reduce((acc, item) => acc + item.total, 0),
    });
  } catch (error) {
    // Lidar com erros durante o processo
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter o total de receitas
router.get('/revenues/total', async (req, res) => {
  try {
    // Buscar o total de receitas
    const totalRevenues = await Revenues.aggregate([
      {
        $group: {
          _id: '$totalAmount',  // Agrupa por totalAmount
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Retornar o total de receitas como resposta
    res.json({
      totalRevenues: totalRevenues.reduce((acc, item) => acc + item.total, 0),
    });
  } catch (error) {
    // Lidar com erros durante o processo
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

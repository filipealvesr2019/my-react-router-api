const express = require('express');
const router = express.Router();
const Revenues = require('../../models/revenues/revenues');
const Expense = require('../models/expense');

// Rota para obter o total de despesas
router.get('/expenses/total', async (req, res) => {
  try {
    // Buscar o total de despesas
    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Retornar o total de despesas como resposta
    res.json({
      totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
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
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Retornar o total de receitas como resposta
    res.json({
      totalRevenues: totalRevenues.length > 0 ? totalRevenues[0].total : 0,
    });
  } catch (error) {
    // Lidar com erros durante o processo
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

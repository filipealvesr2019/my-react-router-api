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



// Rota para obter a diferença entre o total de receitas e despesas
router.get('/difference', async (req, res) => {
  try {
    // Buscar o total de receitas
    const totalRevenues = await Revenues.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$paidValue' },
        },
      },
    ]);

    // Buscar o total de despesas
    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$paidValue' },
        },
      },
    ]);

    // Calcular a diferença entre o total de receitas e despesas
    const difference = (totalRevenues[0]?.total || 0) - (totalExpenses[0]?.total || 0);

    // Retornar a diferença como resposta
    res.json({ difference });
  } catch (error) {
    // Lidar com erros durante o processo
    res.status(500).json({ message: error.message });
  }
});



// Rota para obter todas as movimentações (receitas e despesas)
router.get('/transactions', async (req, res) => {
  try {
    const revenues = await Revenues.find();
    const expenses = await Expense.find();

    // Combine as receitas e despesas em uma única lista
    const transactions = [...revenues, ...expenses];

    // Ordene a lista de transações por data (ou outro critério relevante)
    transactions.sort((a, b) => a.date - b.date);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router;

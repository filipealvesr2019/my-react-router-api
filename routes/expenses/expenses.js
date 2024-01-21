// routes/expense.js

const express = require('express');
const router = express.Router();
const Expense = require('../../models/expenses/expenses');

// Rota para obter todas as despesas
router.get('/expense', async (req, res) => {
  try {
    const expenses = await Expense.find().populate('vendor account category paymentType');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar uma nova despesa
router.post('/create/expense', async (req, res) => {
  const expense = new Expense({
    description: req.body.description,
    amount: req.body.amount,
    vendor: req.body.vendor,
    account: req.body.account,
    category: req.body.category,
    paymentType: req.body.paymentType,
    date: req.body.date,
    document: req.body.document,
    // Adicione outros campos conforme necessário
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

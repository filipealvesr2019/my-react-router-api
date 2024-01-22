// routes/expense.js

const express = require('express');
const router = express.Router();
const Expense = require('../../models/expense');

// Rota para obter todas as despesas
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Rota para criar uma nova despesa
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
      totalAmount: req.body.totalAmount,
      paymentDate: req.body.paymentDate,
      paidValue: req.body.paidValue,
      dueDate: req.body.dueDate,

      status: req.body.date < new Date() ? 'overdue' : 'pending', // Verifica se a despesa está vencida
      // Adicione outros campos conforme necessário
    });
  
    try {
      const newExpense = await expense.save();
      res.status(201).json(newExpense);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Rota para tornar as despesas "atrasadas"
router.put('/make-expenses-overdue', async (req, res) => {
  try {
    const overdueExpenses = await Expense.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'overdue' },
    });

    if (overdueExpenses.length > 0) {
      await Expense.updateMany(
        { _id: { $in: overdueExpenses.map(exp => exp._id) } },
        { $set: { status: 'overdue' } }
      );

      res.json({ message: 'Despesas atualizadas com sucesso.' });
    } else {
      res.json({ message: 'Não há despesas para atualizar.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;

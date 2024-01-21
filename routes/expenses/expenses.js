// routes/expense.js

const express = require('express');
const router = express.Router();
const Expense = require('../../models/expenses/expenses');

// Rota para obter todas as despesas
router.get('/expense', async (req, res) => {
    try {
      const expenses = await Expense.find()
        .populate('vendor account category paymentType')
        .select('+status'); // Adicione esta linha para incluir "status" na projeção
  
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
  
  // Rota para atualizar o status das despesas vencidas
 // Rota para atualizar as despesas vencidas
router.put('/update/overdue-expenses', async (req, res) => {
    try {
      // Encontre todas as despesas vencidas
      const overdueExpenses = await Expense.find({
        dueDate: { $lt: new Date() },
        status: { $ne: 'overdue' },
      });
  
      // Verifique se há despesas vencidas
      if (overdueExpenses.length > 0) {
        // Atualize o status dessas despesas para 'overdue'
        await Expense.updateMany(
          { _id: { $in: overdueExpenses.map(exp => exp._id) } },
          { $set: { status: 'overdue' } }
        );
  
        res.json({ message: 'Despesas vencidas atualizadas com sucesso.' });
      } else {
        res.json({ message: 'Não há despesas vencidas para atualizar.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
module.exports = router;

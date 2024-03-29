// routes/expense.js

const express = require('express');
const router = express.Router();
const Expense = require('../../models/expense');
const moment = require('moment'); // Adicione esta linha

// Rota para obter todas as despesas com paginação
router.get('/expenses', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página a ser exibida (padrão: 1)
    const limit = parseInt(req.query.limit) || 10; // Número de documentos por página (padrão: 10)

    const skip = (page - 1) * limit; // Calcular quantos documentos pular

    const expenses = await Expense.find()
      .skip(skip)
      .limit(limit);

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Rota para criar uma nova despesa
// Rota para criar uma nova despesa
router.post('/create/expense', async (req, res) => {
    const expense = new Expense({
      type:req.body.type,
      description: req.body.description,
      amount: req.body.amount,
      supplier: req.body.supplier,
      account: req.body.account,
      category: req.body.category,
      paymentType: req.body.paymentType,
      date: req.body.date,
      document: req.body.document,
      totalAmount: req.body.totalAmount,
      paymentDate: req.body.paymentDate,
      paidValue: req.body.paidValue,
      dueDate: req.body.dueDate,
      month: req.body.month,
    

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



// Rota para obter o total de despesas
router.get('/totalExpenses', async (req, res) => {
  try {
    // Encontre todas as despesas
    const expenses = await Expense.find();

    // Calcule o total das despesas
    const totalExpenses = expenses.reduce((total, expense) => total + expense.totalAmount, 0);

    res.json({ totalExpenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter o total das despesas vencidas
router.get('/total-overdue-expenses', async (req, res) => {
  try {
    // Encontre todas as despesas vencidas
    const overdueExpenses = await Expense.find({
      dueDate: { $lt: new Date() },
      status: 'overdue',
    });

    // Calcule o total das despesas vencidas
    const totalOverdueExpenses = overdueExpenses.reduce(
      (total, expense) => total + expense.totalAmount,
      0
    );

    res.json({ totalOverdueExpenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para atualizar uma despesa específica
router.put('/update-expense/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      req.body, // Use o corpo da solicitação como os novos valores
      { new: true } // Isso garante que a função retorna a despesa atualizada
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Despesa não encontrada.' });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/total-overdue-expenses-current-month', async (req, res) => {
  try {
    const primeiroDiaDoMesAtual = moment().startOf('month');
    console.log('Primeiro dia do mês atual:', primeiroDiaDoMesAtual.format('YYYY-MM'));

    const overdueExpensesCurrentMonth = await Expense.find({
      dueDate: { $lt: new Date() },
      status: 'overdue',
      month: primeiroDiaDoMesAtual.format('YYYY-MM'),
    });
    console.log('Despesas vencidas do mês atual:', overdueExpensesCurrentMonth);

    const totalOverdueExpensesCurrentMonth = overdueExpensesCurrentMonth.reduce(
      (total, expense) => total + expense.totalAmount,
      0
    );

    res.json({ totalOverdueExpensesCurrentMonth });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;

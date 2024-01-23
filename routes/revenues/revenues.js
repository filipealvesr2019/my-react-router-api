const express = require('express');
const router = express.Router();
const Revenues = require('../../models/revenues/revenues');
const Expense = require('../../models/expense');




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

// Rota para tornar as receitas "atrasadas"
router.put('/make-revenues-overdue', async (req, res) => {
  try {
    const overdueRevenues = await Revenues.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'overdue' },
    });

    if (overdueRevenues.length > 0) {
      await Revenues.updateMany(
        { _id: { $in: overdueRevenues.map(rev => rev._id) } },
        { $set: { status: 'overdue' } }
      );

      res.json({ message: 'Receitas atualizadas com sucesso.' });
    } else {
      res.json({ message: 'Não há receitas para atualizar.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Rota para obter o saldo do mês atual
router.get('/monthly-balance', async (req, res) => {
  try {
    // Obter o ano e mês atual
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // O mês no JavaScript é baseado em zero (janeiro = 0)

    // Calcular a data de início do mês
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);

    // Calcular a data de término do mês
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    // Encontrar todas as receitas do mês atual
    const currentMonthRevenues = await Revenues.find({
      paymentDate: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // Encontrar todas as despesas do mês atual
    const currentMonthExpenses = await Expense.find({
      paymentDate: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // Calcular o total das receitas do mês atual
    const totalRevenues = currentMonthRevenues.reduce(
      (total, revenue) => total + revenue.totalAmount,
      0
    );

    // Calcular o total das despesas do mês atual
    const totalExpenses = currentMonthExpenses.reduce(
      (total, expense) => total + expense.totalAmount,
      0
    );

    // Calcular o saldo do mês atual
    const balance = totalRevenues - totalExpenses;

    res.json({ totalRevenues, totalExpenses, balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






module.exports = router;

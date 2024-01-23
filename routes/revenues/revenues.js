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









router.get('/balance/:month', async (req, res) => {
  const { month } = req.params;

  try {
    // Busque as receitas para o mês específico
    const revenues = await Revenues.find({ month });

    // Busque as despesas para o mês específico
    const expenses = await Expense.find({ month });

    // Calcule o total de receitas para o mês
    const totalRevenues = revenues.reduce((acc, revenue) => acc + revenue.totalAmount, 0);

    // Calcule o total de despesas para o mês
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.totalAmount, 0);

    // Calcule a diferença entre despesas e receitas
    const diferenca = totalRevenues - totalExpenses;

    res.json({ diferenca });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular a diferença entre receitas e despesas.' });
  }
});
module.exports = router;

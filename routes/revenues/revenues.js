const express = require('express');
const router = express.Router();
const Revenues = require('../../models/revenues/revenues');
const Expense = require('../../models/expense');
const cron = require('node-cron');




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
















// Rota para o saldo do mês atual
router.get('/balance/current', async (req, res) => {
  try {
    const currentMonth = getFormattedMonth(new Date());
    const balance = await calculateBalance(currentMonth);

    res.json({
      month: currentMonth,
      balance: balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para o saldo do mês anterior
router.get('/balance/previous', async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const lastMonthFormatted = getFormattedMonth(lastMonth);
    
    const balance = await calculateBalance(lastMonthFormatted);

    res.json({
      month: lastMonthFormatted,
      balance: balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Atualização automática a cada segundo usando cron
cron.schedule('* * * * * *', async () => {
  console.log('Updating balances every second');
  // Atualize os saldos aqui chamando a função calculateBalance e salvando os resultados.
});
async function calculateBalance(month) {
  const revenues = await Revenues.find({ month });
  const expenses = await Expense.find({ month });

  const totalRevenues = revenues.reduce((acc, revenue) => acc + revenue.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + (expense.paidValue !== 0 ? expense.paidValue : expense.totalAmount), 0);

  return totalRevenues - totalExpenses;
}



// Função para formatar o mês
function getFormattedMonth(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}



module.exports = router;

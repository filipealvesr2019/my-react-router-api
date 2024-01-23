const express = require('express');
const router = express.Router();
const Revenues = require('../../models/revenues/revenues');
const Expense = require('../../models/expense');
const cron = require('node-cron');
const moment = require('moment'); // Certifique-se de instalar o módulo moment com 'npm install moment'




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














// Rota para calcular e mostrar a diferença entre receitas e despesas
router.get('/diferenca', async (req, res) => {
  try {
    // Obter o primeiro dia do mês atual
    const primeiroDiaDoMesAtual = moment().startOf('month');

    // Obter o primeiro dia do mês anterior
    const primeiroDiaDoMesAnterior = moment().subtract(1, 'month').startOf('month');

    // Obter todas as receitas e despesas do mês atual
    const receitasDespesasMesAtual = await Revenues.find({
      month: primeiroDiaDoMesAtual.format('YYYY-MM')
    });

    const despesasMesAtual = await Expense.find({
      month: primeiroDiaDoMesAtual.format('YYYY-MM')
    });

    // Obter todas as receitas e despesas do mês anterior
    const receitasDespesasMesAnterior = await Revenues.find({
      month: primeiroDiaDoMesAnterior.format('YYYY-MM')
    });

    const despesasMesAnterior = await Expense.find({
      month: primeiroDiaDoMesAnterior.format('YYYY-MM')
    });

    // Juntar receitas e despesas
    const todasAsReceitasDespesasMesAtual = [...receitasDespesasMesAtual, ...despesasMesAtual];
    const todasAsReceitasDespesasMesAnterior = [...receitasDespesasMesAnterior, ...despesasMesAnterior];

    // Calcular a diferença entre receitas e despesas para o mês atual
    const diferencaMesAtual = calcularDiferenca(todasAsReceitasDespesasMesAtual);

    // Calcular a diferença entre receitas e despesas para o mês anterior
    const diferencaMesAnterior = calcularDiferenca(todasAsReceitasDespesasMesAnterior);

    res.send(`
      Diferença para o Mês Atual:
        Diferença: ${diferencaMesAtual}
      
      Diferença para o Mês Anterior:
        Diferença: ${diferencaMesAnterior}
    `);
  } catch (error) {
    console.error('Erro ao calcular a diferença:', error);
    res.status(500).send('Erro ao calcular a diferença');
  }
});

// Função para calcular a diferença entre receitas e despesas
function calcularDiferenca(lista) {
  return lista.reduce((total, item) => {
    return item.type === 'revenues' ? total + item.totalAmount : total - item.totalAmount;
  }, 0);
}





module.exports = router;

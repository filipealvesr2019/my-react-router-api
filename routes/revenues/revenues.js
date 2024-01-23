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
    const diferencaMesAtual = await calcularDiferencaDoMes('atual');
    const diferencaMesAnterior = await calcularDiferencaDoMes('anterior');

    res.json({
      diferencaMesAtual,
      diferencaMesAnterior
    });
  } catch (error) {
    console.error('Erro ao calcular a diferença:', error);
    res.status(500).json({ error: 'Erro ao calcular a diferença' });
  }
});

// Lógica centralizada para calcular a diferença entre receitas e despesas de um mês
async function calcularDiferencaDoMes(tipo) {
  const primeiroDiaDoMes = tipo === 'atual' ? moment().startOf('month') : moment().subtract(1, 'month').startOf('month');
  const receitasMes = await Revenues.find({ month: primeiroDiaDoMes.format('YYYY-MM') });
  const despesasMes = await Expense.find({ month: primeiroDiaDoMes.format('YYYY-MM') });
  const todasAsReceitasDespesasMes = [...receitasMes, ...despesasMes];
  return calcularDiferenca(todasAsReceitasDespesasMes);
}

// Função para calcular a diferença entre receitas e despesas
function calcularDiferenca(lista) {
  return lista.reduce((total, item) => {
    return item.type === 'revenues' ? total + item.totalAmount : total - item.totalAmount;
  }, 0);
}

// Tarefa cron para calcular e atualizar as diferenças no início de cada mês
cron.schedule('0 0 */25 * *', async () => {
  try {
    await calcularEAtualizarDiferencas('atual');
    await calcularEAtualizarDiferencas('anterior');
    console.log('Diferenças calculadas e atualizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao calcular e atualizar as diferenças:', error);
  }
}, {
  scheduled: true,
  timezone: 'America/Sao_Paulo' // Ajuste o fuso horário conforme necessário
});

// Função para calcular e atualizar as diferenças
async function calcularEAtualizarDiferencas(tipo) {
  const diferenca = await calcularDiferencaDoMes(tipo);
  // Salvar ou atualizar a diferença no banco de dados conforme necessário
  // Substitua o trecho abaixo pelo código específico do seu modelo e esquema
  console.log(`Diferença do mês ${tipo}: ${diferenca}`);
}



module.exports = router;

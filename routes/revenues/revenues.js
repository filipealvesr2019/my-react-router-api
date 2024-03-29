const express = require('express');
const router = express.Router();
const Revenues = require('../../models/revenues/revenues');
const Expense = require('../../models/expense');
const cron = require('node-cron');
const moment = require('moment'); // Certifique-se de instalar o módulo moment com 'npm install moment'


// Rota para obter todas as receitas com paginação
router.get('/revenues', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página a ser exibida (padrão: 1)
    const limit = parseInt(req.query.limit) || 10; // Número de documentos por página (padrão: 10)

    const skip = (page - 1) * limit; // Calcular quantos documentos pular

    const revenues = await Revenues.find()
      .skip(skip)
      .limit(limit);

    res.json(revenues);
  } catch (error) {
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








// Função para obter o total de receitas vencidas do mês atual
async function obterTotalReceitasVencidasMesAtual() {
  try {
    const primeiroDiaDoMesAtual = moment().startOf('month');
    const receitasVencidasMesAtual = await Revenues.find({
      type: 'revenues',
      status: 'overdue', // Receitas com status 'overdue'
      month: primeiroDiaDoMesAtual.format('YYYY-MM')
    });

    const totalReceitasVencidasMesAtual = receitasVencidasMesAtual.reduce((total, receita) => {
      return total + receita.totalAmount;
    }, 0);

    return totalReceitasVencidasMesAtual;
  } catch (error) {
    throw error;
  }
}

// Adicione esta rota para obter o total de receitas vencidas do mês atual
router.get('/total-overdue-revenues', async (req, res) => {
  try {
    const totalReceitasVencidasMesAtual = await obterTotalReceitasVencidasMesAtual();
    res.json({ totalReceitasVencidasMesAtual });
  } catch (error) {
    console.error('Erro ao obter o total de receitas vencidas do mês atual:', error);
    res.status(500).json({ error: 'Erro ao obter o total de receitas vencidas do mês atual' });
  }
});


// Função para obter o total de receitas do mês atual
async function obterTotalReceitasMesAtual() {
  try {
    const primeiroDiaDoMesAtual = moment().startOf('month');
    const receitasMesAtual = await Revenues.find({
      type: 'revenues',
      month: primeiroDiaDoMesAtual.format('YYYY-MM')
    });

    const totalReceitasMesAtual = receitasMesAtual.reduce((total, receita) => {
      return total + receita.totalAmount;
    }, 0);

    return totalReceitasMesAtual;
  } catch (error) {
    throw error;
  }
}

// Adicione esta rota para obter o total de receitas do mês atual
router.get('/total-revenues', async (req, res) => {
  try {
    const totalReceitasMesAtual = await obterTotalReceitasMesAtual();
    res.json({ totalReceitasMesAtual });
  } catch (error) {
    console.error('Erro ao obter o total de receitas do mês atual:', error);
    res.status(500).json({ error: 'Erro ao obter o total de receitas do mês atual' });
  }
});







// Rota para calcular e mostrar a diferença entre receitas e despesas
router.get('/balance', async (req, res) => {
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
cron.schedule('0 0 */30 * *', async () => {
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

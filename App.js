const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cron = require('node-cron');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');



require('dotenv').config();

// Configurações e middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(cookieParser());


// Rotas
const AuthRoutes = require('./routes/AuthRoutes');
const orders = require('./routes/order');


const products = require('./routes/products')
const auth = require('./routes/Customer')
const order = require('./routes/order')
const category = require('./routes/category');
const subcategory = require('./routes/Subcategory');

const slider = require('./routes/Slider');
const discount = require('./routes/discount');
const transactionRouter = require('./routes/transactions');
const vendor = require('./routes/vendor');
const paymentType = require('./routes/paymentType');
const categoryType = require('./routes/categoryType');

const account = require('./routes/account');
const expenseRouter = require('./routes/expense/expenses');




app.use('/api', products)
app.use('/api', auth)
app.use('/api', order)
app.use('/api', category)
app.use('/api', subcategory)
app.use('/api', slider)
app.use('/api', discount);

app.use('/', AuthRoutes);
app.use('/api', orders);

app.use('/api', transactionRouter);
app.use('/api', vendor);
app.use('/api', paymentType);
app.use('/api', categoryType);
app.use('/api', account);
app.use('/api', expenseRouter);



// Agende a execução da rota a cada dia às 3:00 AM
cron.schedule('0 */6 * * *', async () => {
  try {
    console.log('Cronjob executado com sucesso.');
    const overdueExpenses = await Expense.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'overdue' },
    });
    console.log('Despesas vencidas encontradas:', overdueExpenses);

    if (overdueExpenses.length > 0) {
      console.log('Atualizando status das despesas para "overdue".');
      await Expense.updateMany(
        { _id: { $in: overdueExpenses.map(exp => exp._id) } },
        { $set: { status: 'overdue' } }
      );
      console.log('Despesas vencidas atualizadas com sucesso.');
    } else {
      console.log('Não há despesas vencidas para atualizar.');
    }
  } catch (error) {
    console.error('Erro ao atualizar despesas vencidas:', error);
  }
});



app.use(express.json());




// Acesso à variável de ambiente MONGODB_URI do arquivo .env
const uri = process.env.MONGODB_URI;



// Conexão com o banco de dados
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao banco de dados');
}).catch((error) => {
  console.error('Erro de conexão com o banco de dados:', error);
});

// Iniciar o servidor
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor em execução na porta http://localhost:${port}`);
});



module.exports = app;
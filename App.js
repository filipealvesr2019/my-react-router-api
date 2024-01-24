const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cron = require('node-cron');
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
  origin: ['http://localhost:3000', 'https://my-react-router-app.vercel.app'],
  credentials: true,
};
app.use(cors(corsOptions));




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
const supplier = require('./routes/supplier');
const vendor = require('./routes/vendor');
const paymentType = require('./routes/paymentType');
const categoryType = require('./routes/categoryType');
const categoryTypeRevenues = require('./routes/categoryTypeRevenues');

const account = require('./routes/account');
const expenseRouter = require('./routes/expense/expenses');
const revenuesRouter = require('./routes/revenues/revenues');
const transactions = require('./routes/transactions');
const categoryStockRoutes = require('./routes/productStock/categoryStock'); // Nova rota para CategoryStock




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
app.use('/api', supplier);
app.use('/api', vendor);

app.use('/api', paymentType);
app.use('/api', categoryType);
app.use('/api', categoryTypeRevenues);

app.use('/api', account);
app.use('/api', expenseRouter);
app.use('/api', revenuesRouter);
app.use('/api', transactions);
app.use('/api', categoryStockRoutes); // Nova rota para CategoryStock





// Agende a execução da rota de atualização a cada dia às 3:00 AM
// Agende a execução da rota de atualização a cada segundo
// Agende a execução da rota de atualização a cada segundo
cron.schedule('0 */6 * * *', async () => {
  try {
    await axios.put('http://localhost:3001/api/make-expenses-overdue');
    console.log('Cronjob executado');
  } catch (error) {
    console.error('Erro ao executar o cronjob:', error);
  }
});

cron.schedule('0 */6 * * *', async () => {
  try {
    await axios.put('http://localhost:3001/api/make-revenues-overdue');
    console.log('Cronjob executado');
  } catch (error) {
    console.error('Erro ao executar o cronjob:', error);
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
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
app.use(bodyParser.json());
app.use(cookieParser());
// Configurações e middlewares
app.use(cors({ origin: "*"}));




require('dotenv').config();




// Rotas
const AuthRoutes = require('./routes/AuthRoutes');
const orders = require('./routes/order');


const products = require('./routes/products')
const authCustomer = require('./routes/Customer')
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
const unitOfMeasure = require('./routes/productStock/unitOfMeasure'); // Nova rota para CategoryStock
const productStock = require('./routes/productStock/productStock'); // Nova rota para CategoryStock
const nutureRoutes = require('./routes/NatureType'); // Nova rota para CategoryStock
const buyRoutes = require('./routes/stock/buy'); // Nova rota para CategoryStock
const budgetRoutes = require('./routes/stock/budget'); // Nova rota para CategoryStock

const purchaseOrder = require('./routes/stock/purchaseOrder'); // Nova rota para CategoryStock
const salesOrders = require('./routes/stock/salesOrders'); // 

const cart = require('./routes/cart'); // Nova rota para CategoryStock


app.use('/api', products)
app.use('/api', authCustomer)
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

app.use('/api', unitOfMeasure); // Nova rota para CategoryStock
app.use('/api', productStock); // Nova rota para CategoryStock

app.use('/api', nutureRoutes); // Nova rota para CategoryStock
app.use('/api', buyRoutes); // Nova rota para CategoryStock
app.use('/api', budgetRoutes); // Nova rota para CategoryStock

app.use('/api', salesOrders); // Nova rota para CategoryStock
app.use('/api', purchaseOrder); 
app.use('/api', cart); 






















// Exemplo de uso: app.get('/perfil', ensureAuthenticated, (req, res) => { ... });

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
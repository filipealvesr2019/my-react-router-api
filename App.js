const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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
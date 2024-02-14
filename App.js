const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cron = require('node-cron');
const axios = require('axios');
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(cookieParser());
// Configurações e middlewares
app.use(cors({ origin: "*",
methods:["GET", "POST", "DELETE" ]}));




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



const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: '379126267894-7kuo4ag9ae8sa2qf9de0a1bmj61vn88k.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3001/auth/google/callback',
  scope: ['profile', 'email'], // Escopos necessários

},
(accessToken, refreshToken, profile, done) => {
  // Lógica de autenticação
  return done(null, profile);
}));
const generateSessionSecret = () => {
  // Lógica para gerar dinamicamente o segredo da sessão
  return process.env.SECRET_SESSION || 'seu-segredo-padrao';
};

// Configuração da sessão
app.use(session({
  secret:' generateSessionSecret()',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirecionar ou lidar com a autenticação bem-sucedida
    res.redirect('/');
  }

);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.use(require('express-session')({ secret: 'seu-segredo', resave: true, saveUninitialized: true }));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redireciona para a página de login
}

app.get('/login', (req, res) => {
  // Lógica para renderizar a página de login
  res.send('Esta é a página de login!');
});

app.get('/profile', (req, res) => {
  // Lógica para obter os dados do perfil do usuário
  // Substitua isso com a lógica real para obter os dados do usuário do seu sistema de autenticação
  const userProfileData = {
    displayName: 'Nome do Usuário',
    // Adicione mais informações do perfil conforme necessário
  };

  res.json(userProfileData);
});

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
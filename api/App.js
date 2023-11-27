const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const errorHandler = require('./errorHandler/errorHandler');

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(errorHandler);

require('dotenv').config();

// Configurações e middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(cookieParser());


// Rotas
const routes = require('./routes/AuthRoutes');
app.use('/', routes);


const products = require('./routes/products')
const auth = require('./routes/AuthUser')
const order = require('./routes/order')

app.use('/api', products)
app.use('/api', auth)
app.use('/api', order)
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

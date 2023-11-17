const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// Configurações e middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Rotas
const routes = require('./routes/AuthRoutes');
app.use('/', routes);


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
  console.log(`Servidor em execução na porta ${port}`);
});

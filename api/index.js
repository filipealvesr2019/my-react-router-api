const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const users = {
  admin: { email: 'admin@example.com', password: 'admin', role: 'admin' },
  funcionario: { email: 'funcionario@example.com', password: 'funcionario', role: 'funcionario' }
};

app.post('/login', (req, res) => {

  const { email, password } = req.body;

  if (users.admin.email === email && users.admin.password === password) {

    res.send({ role: 'admin' });
  } else if (users.funcionario.email === email && users.funcionario.password === password) {
    res.send({ role: 'funcionario' });
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const port = 3001;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});

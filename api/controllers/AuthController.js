// controllers/AuthController.js
const User = require('../models/User');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email, password: password }).exec();
    if (!user) {
      return res.status(401).send('Credenciais inválidas');
    }

    if (user.role === 'admin') {
      return res.send({ role: 'admin' });
    } else if (user.role === 'funcionario') {
      return res.send({ role: 'funcionario' });
    } else {
      return res.status(403).send('Acesso negado. Apenas o admin e o funcionario podem entrar.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
};

const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.create({ email, password, role });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao criar usuário');
  }
};

module.exports = { login, createUser };

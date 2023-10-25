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

module.exports = { login };

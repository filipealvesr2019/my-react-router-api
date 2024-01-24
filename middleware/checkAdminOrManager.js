const jwt = require('jsonwebtoken');
const User = require('../models/AuthUser');

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new Error('Token não encontrado');

    const decoded = jwt.verify(token, 'seu-segredo-do-jwt');
    req.user = await User.findById(decoded.id);

    if (!req.user) throw new Error('Usuário não encontrado');

    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: 'Falha na autenticação' });
  }
};

module.exports = isAuthenticatedUser;

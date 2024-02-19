// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
    const user = req.clerk.session.user;
  
    if (!user.roles.includes('admin')) {
      return res.status(403).send('Acesso negado. Você não é um administrador.');
    }
  
    next();
  };
  
  module.exports = isAdmin;
  
const jwt = require('jsonwebtoken');
const User = require('../models/AuthUser'); // Importe o modelo do usuário aqui

// Middleware para verificar se o usuário está autenticado
const isAuthenticated = async (req, res, next) => {
    try {
        // Verifique se o cabeçalho Authorization está presente
        const authHeader = req.headers.authorization;
    
        if (!authHeader) {
          return res.status(401).json({ message: 'Token de acesso não fornecido.' });
        }
    
        // Verifique se o cabeçalho Authorization começa com "Bearer"
        const [bearer, token] = authHeader.split(' ');
    
        if (bearer !== 'Bearer' || !token) {
          return res.status(401).json({ message: 'Token de acesso inválido.' });
        }
    
        // Verifique se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        // Verifique se o usuário existe no banco de dados
        const user = await User.findById(decoded.id);
    
        if (!user) {
          return res.status(401).json({ message: 'Usuário não encontrado.' });
        }
    
        // Adicione o usuário ao objeto de solicitação para uso posterior
        req.user = user;
    
        // Chame o próximo middleware
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Token de acesso inválido.' });
      }
};

module.exports = { isAuthenticated };

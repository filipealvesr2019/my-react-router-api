const jwt = require('jsonwebtoken');
const User = require('../models/UserRole');

const protect = async (req, res, next) => {
    let token;
    // Verificar se o token está presente nos cabeçalhos
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Acesso não autorizado.' });
    }

    try {
        // Verificar se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adicionar o usuário ao objeto da solicitação
        req.user = await User.findById(decoded.id);

        // Verificar as permissões do usuário
        if (req.user.role === 'administrador' || req.user.role === 'funcionario') {
            // Se for admin ou funcionario, permitir o acesso
            next();
        } else {
            // Se não tiver permissões necessárias, negar o acesso
            return res.status(403).json({ success: false, error: 'Acesso não permitido.' });
        }
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' });
    }
};

module.exports = protect;

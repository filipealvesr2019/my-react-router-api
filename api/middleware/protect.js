const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
        if (req.user.role === 'admin') {
            // Se for administrador, permitir o acesso total
            next();
        } else if (req.user.role === 'funcionario') {
            // Se for funcionário, permitir acesso limitado (por exemplo, apenas adição de produtos)
            if (req.method === 'POST' && req.path === '/admin/product/new') {
                // Se for uma solicitação de adição de produto, permitir
                next();
            } else {
                // Caso contrário, negar o acesso
                return res.status(403).json({ success: false, error: 'Acesso não permitido.' });
            }
        } else {
            // Se não for administrador nem funcionário, negar o acesso
            return res.status(403).json({ success: false, error: 'Acesso não permitido.' });
        }
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' });
    }
};

module.exports = protect;

// Middleware para tratamento de erro global
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Verificar se é um erro relacionado ao JWT
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' });
    }

    // Outros tipos de erro
    res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
};

module.exports = errorHandler;

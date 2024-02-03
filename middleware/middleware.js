const jwt = require("jsonwebtoken");
const User = require("../models/AuthUser");

exports.isAuthorizedToDeleteProduct = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Acesso negado, faça login para acessar esta página."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        // Verificar se o usuário está autenticado e tem a função adequada
        if (!req.user || !validateRole(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "Você não tem permissão para realizar esta ação."
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Token de autenticação inválido."
        });
    }
};

function validateRole(value) {
    const allowedRoles = ["administrador", "Gerente", "funcionario"];
    return allowedRoles.includes(value);
}

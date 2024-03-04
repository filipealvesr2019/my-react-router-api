const jwt = require("jsonwebtoken")
const User = require("../models/AuthUser")
// verifica se o usuario esta autenticado
exports.isAuthenticatedUser = async (req, res, next) =>{

    const {token} = req.cookies

    if(!token){
        return res.status(401).json({
            success:false,
            error:"Acesso negado faça login para acessar essa pagina"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)

    next()
}





const User = require("../models/user")
const validator = require("validator");
const sendToken = require("../utils/jwtToken");


// cadastro de usuarios => /api/v1/register
exports.registerUser = async (req, res, next) => {
    const { name, email, password} = req.body;
    
    if(password.length < 10){
        return res.status(400).json({
            success:false,
            error:"A senha deve ter pelo menos 10 caracteres."
        })
    }

    if(!name || name.length === 0){
        return res.status(400).json({
            success:false,
            error:"Digite um nome válido."
        })
    }

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            error: "Digite um endereço de email válido.",
        });
    }

    try{
        const user = await User.create({
            name, email, password, avatar:{
                publica_id: "/avatars/michael-dam-mEZ3PoFGs_k-unsplash_2_pmcmih",
                url:"https://res.cloudinary.com/dcodt2el6/image/upload/v1700826137/avatars/michael-dam-mEZ3PoFGs_k-unsplash_2_pmcmih.jpg"
            }
        })
        
        
    sendToken(user, 200, res)
    }catch(error){
        console.error("Erro, ao cadastrar usuario" ,error);
        res.status(500).json({
            success:false,
            error:"Erro interno do servidor."
        })
    }

 
}

// logar usuario com JWT token
exports.loginUser = async(req, res, next) => {
    const {email, password} =  req.body;

    // verifica se o usuario esta logado com email e senha
    if(!email || !password){
        return res.status(400).json({
            success:false,
            error:"Email e senha são obrigatórios."
        })
    }

    // procurando usuario no banco de dados
    const user =  await  User.findOne({email}).select("+ password")
    if(!user){
        return res.status(401).json({
            success:false,
            error:"Email ou senha invalida."
        })
    }

    // verifica se a senha esta correta ou não
    const isPasswordMatch = user.comparePassword(password)
    if(!isPasswordMatch){
        return res.status(401).json({
            success:false,
            error:"Email ou senha invalida."
        })
    }

    sendToken(user, 200, res)
} 

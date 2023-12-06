const User = require("../models/UserRole");
const validator = require("validator");
const sendToken = require("../utils/jwtToken");

// cadastro de usuarios => /api/v1/register
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!password) {
    return res.status(400).json({
      success: false,
      error: "A senha é obrigatória.",
    });
  }


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "Usuário com este email já existe.",
    });
    
  }

  if (password.length < 10) {
    return res.status(400).json({
      success: false,
      error: "A senha deve ter pelo menos 10 caracteres.",
    });
  }

  if (!name || name.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Digite um nome válido.",
    });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Digite um endereço de email válido.",
    });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        publica_id: "/avatars/michael-dam-mEZ3PoFGs_k-unsplash_2_pmcmih",
        url: "https://res.cloudinary.com/dcodt2el6/image/upload/v1700826137/avatars/michael-dam-mEZ3PoFGs_k-unsplash_2_pmcmih.jpg",
      },
    });

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Erro, ao cadastrar usuario", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor.",
    });
  }
};

// logar usuario com JWT token
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // verifica se o usuario esta logado com email e senha
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email e senha são obrigatórios.",
    });
  }

  // procurando usuario no banco de dados
  const user = await User.findOne({ email }).select("+ password");
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Email ou senha invalida.",
    });
  }

  // verifica se a senha esta correta ou não
  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      error: "Email ou senha invalida.",
    });
  }

  sendToken(user, 200, res);
};

// deslogar um usuario api/v1/logout
exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Deslogado",
  });
};


// admin routes

// get all users => /api/v1/admin/users
exports.allUsers = async (req, res, next) => {
     
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
      });
}


exports.getUserDetails = async (req, res, next) => {
    const user =  await User.findById(req.params.id);

    if(!user){
        return  res.status(400).json({
            success: false,
            error:"Usuario não encontrado com esse id"
          });
    }


    res.status(200).json({
        success: true,
        user
      });

    
}



// update admin
exports.updateAdminProfile = async (req, res, next) => {
    const newUserData  = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }   
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    // Responde à requisição com um status 200 (OK) e envia um objeto JSON contendo sucesso (success: true) e os dados do usuário encontrado.
    res.status(200).json({
        success: true,
        user
    })
}


exports.deleteAdminProfile = async (req, res, next) => {
    const user =  await User.findById(req.params.id);

    if(!user){
        return  res.status(400).json({
            success: false,
            error:"Erro ao deletar usuario com esse id"
          });
    }
    
    // remover avatar do cloundnary
    
    await user.deleteOne()
    res.status(200).json({
        success: true,
        user
      });

    
}




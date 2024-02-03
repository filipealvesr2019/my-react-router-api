const User = require("../models/Customer");
const validator = require("validator");
const sendToken = require("../utils/jwtToken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// cadastro de usuarios => /api/v1/register
exports.registerCustumers = async (req, res, next) => {
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
exports.loginCustumer = async (req, res, next) => {
  const {  email, password } = req.body;
  
  
  // verifica se o usuario esta logado com email e senha
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email e senha são obrigatórios.",
    });
  }

  if(!password){
    return "senha ou email incoreta!"
  }

  // procurando usuario no banco de dados
  const user = await User.findOne({ email }).select("+ password");
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Email ou senha invalida.",
    });
  }
  

  // Verifica se o usuário está temporariamente bloqueado devido a muitas tentativas de login incorretas
  if (user.lockUntil > Date.now()) {
    return res.status(401).json({
      success: false,
      error: `Você excedeu o número máximo de tentativas de login. Tente novamente após ${calculateRemainingLockTime(user.lockUntil)} minutos.`,
    });
  }

  // verifica se a senha esta correta ou não
  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) {
    user.loginAttempts += 1;
    await user.save();
  }

  // ...

  // Se a senha estiver incorreta após 3 tentativas, bloqueie temporariamente o usuário por 1 hora
  if (!isPasswordMatch && user.loginAttempts >= 3) {
    user.lockUntil = Date.now() + 3600000; // Bloqueado por 1 hora
    user.loginAttempts = 0; // Reinicia o contador de tentativas de login
    await user.save();
  }
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      error: "Email ou senha invalida.",
    });
  }

  sendToken(user, 200, res);
};

// deslogar um usuario api/v1/logout
exports.Custumerlogout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Deslogado",
  });
};

function calculateRemainingLockTime(lockUntil) {
  const remainingTime = Math.ceil((lockUntil - Date.now()) / 60000); // Calcula o tempo restante em minutos
  return remainingTime;
}

// get all users => /api/v1/admin/users
exports.getAllCustumers = async (req, res, next) => {
     
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
      });
}


exports.getCustumerDetails = async (req, res, next) => {
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
exports.updateCustumer = async (req, res, next) => {
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


exports.deleteCustumer = async (req, res, next) => {
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


// Middleware para verificar se o usuário está autenticado
exports.AuthenticatedCustumer = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
      return res.status(401).json({
          success: false,
          error: "Acesso negado. Faça login para acessar esta página."
      });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
  } catch (error) {
      return res.status(401).json({
          success: false,
          error: "Token de autenticação inválido."
      });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado com esse e-mail.',
      });
    }

    // Gerar token de redefinição de senha e definir a expiração
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // Token expira em 1 hora
    await user.save();

    // Configurar o transporte do e-mail (Mailtrap)
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // Enviar e-mail
    try {
      console.log('Antes do envio de e-mail');
      await transport.sendMail({
        from: 'filipealvesrds2019@mailtrap.io', // Use o e-mail fornecido pelo Mailtrap
        to: user.email,
        subject: 'Recuperação de Senha',
        text: `Use o seguinte token para redefinir sua senha: ${resetToken}`,
      });
      console.log('E-mail enviado com sucesso para:', user.email);
      res.status(200).json({
        success: true,
        message: 'Um e-mail de recuperação de senha foi enviado.',
      });
    } catch (emailError) {
      console.error('Erro ao enviar e-mail:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Erro ao enviar e-mail de recuperação de senha.',
      });
    } finally {
      console.log('Após o envio de e-mail');
    }
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor.',
    });
  }
};










exports.getCustumerByUsername = async (req, res) => {
  try {
    const username = req.query.username; // Obtendo o nome de usuário do query parameters
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      return res.status(404).send("Usuário não encontrado!");
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).send("Erro ao buscar usuário especifico!");
  }
};









exports.getCustumer = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send("Usuário não encontrado!");
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor ao buscar usuário!");
  }
};

// Função para gerar token de redefinição de senha
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

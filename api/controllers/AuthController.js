// controllers/AuthController.js
const User = require('../models/AuthUser');
const hendleErrors = (err) =>{
  console.log(err.message, err.code)
  let errors = {
    email:"",
    password:"", 
    role:""

  }
  if(err.message.includes("Erro, ao criar usuario")){
    Object.values(err.errors).forEach( ({properties}) =>{
      errors[properties.path] = properties.message;
    })
  }

  return errors;
}
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email, password: password }).exec();
    if (!user) {
      return res.status(401).send('Credenciais inválidas!');
    }

    if (user.role === 'adminstrador') {
      return res.send({ role: 'adminstrador' });
    } else if (user.role === 'funcionario') {
      return res.send({ role: 'funcionario' });
    } else {
      return res.status(403).send('Acesso negado. Apenas o admin e o funcionario podem entrar.');
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro interno do servidor');
  }
};

const createUser = async (req, res) => {
  const { email, password, role } = req.body;
   if (role != "administrador" || "funcionario") {
    console.log('ERRRRRR')
    }
  try {
    const user = await User.create({ email, password, role });
    res.status(201).json(user);
  } catch (err) {
    const errors = hendleErrors(err); 
    res.status(400).send('Erro ao criar usuário!');
  }
};


const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send('Usuário não encontrado!');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao buscar usuário!');
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, password, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, password, role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send('Usuário não encontrado para atualização!');
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).send('Erro ao atualizar usuário!');
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send('Usuário não encontrado para exclusão!');
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(400).send('Erro ao excluir usuário!');
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const username = req.query.username; // Obtendo o nome de usuário do query parameters
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      return res.status(404).send('Usuário não encontrado!');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).send('Erro ao buscar usuário especifico!');
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(400).send('Erro do servidor ao buscar todos os usuários!');
  }
};

module.exports = { login, createUser, getUser, updateUser, deleteUser, getUserByUsername, getAllUsers  };
// controllers/AuthController.js
const User = require('../models/AuthUser');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const sendToken = require("../utils/jwtToken");

// cadastro de usuarios => /api/v1/register
const registerUser = async (req, res, next) => {
  const { email, password, role} = req.body;
  
  if(password.length < 10){
      return res.status(400).json({
          success:false,
          error:"A senha deve ter pelo menos 10 caracteres."
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
          email, password,role,  avatar:{
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
const loginUser = async(req, res, next) => {
  const {email, password, role} =  req.body;

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

module.exports = {  loginUser,
  registerUser, getUser, updateUser, deleteUser, getUserByUsername, getAllUsers  };
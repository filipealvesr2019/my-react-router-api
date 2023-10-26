const UserAdmin = require('../models/UserAdmin');

const createAdmin = async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = await UserAdmin.create({ name, role });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao criar administrador');
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const users = await UserAdmin.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao buscar administradores');
  }
};

const getAdminById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserAdmin.findById(userId);
    if (!user) {
      return res.status(404).send('Administrador não encontrado');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao buscar administrador');
  }
};

const updateAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, role } = req.body;
    const user = await UserAdmin.findByIdAndUpdate(userId, { name, role }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao atualizar administrador');
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    await UserAdmin.findByIdAndDelete(userId);
    res.status(200).send('Administrador excluído com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao excluir administrador');
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};

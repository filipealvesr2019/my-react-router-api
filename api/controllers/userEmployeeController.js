const UserEmployee = require('../models/UserEmployee');

const createEmployee = async (req, res) => {
  try {
    const { name, position } = req.body;
    const user = await UserEmployee.create({ name, position });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao criar funcionário');
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const users = await UserEmployee.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao buscar funcionários');
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserEmployee.findById(userId);
    if (!user) {
      return res.status(404).send('Funcionário não encontrado');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao buscar funcionário');
  }
};

const updateEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, position } = req.body;
    const user = await UserEmployee.findByIdAndUpdate(userId, { name, position }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao atualizar funcionário');
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    await UserEmployee.findByIdAndDelete(userId);
    res.status(200).send('Funcionário excluído com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor ao excluir funcionário');
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

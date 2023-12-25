// controllers/subcategoriesController.js
const Subcategory = require('../models/Subcategory');

// Rota para adicionar nova subcategoria
const createSubcategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Nome da subcategoria é obrigatório.' });
    }

    const newSubcategory = await Subcategory.create({ name });
    res.status(201).json({ success: true, subcategory: newSubcategory });
  } catch (error) {
    console.error('Erro ao criar subcategoria:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
  }
};

// Rota para obter todas as subcategorias
const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.status(200).json({ success: true, subcategories });
  } catch (error) {
    console.error('Erro ao obter subcategorias:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  createSubcategory,
  getSubcategories,
};

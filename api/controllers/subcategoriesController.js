// controllers/subcategoriesController.js
const Subcategory = require('../models/Subcategory');
const Category = require('../models/category');

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

exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const categoryId = req.query.category;

    if (!categoryId) {
      return res.status(400).json({ success: false, error: 'ID da categoria não fornecido.' });
    }

    const subcategories = await Subcategory.find({ category: categoryId });
    return res.status(200).json({ success: true, subcategories });
  } catch (error) {
    console.error('Erro ao obter subcategorias', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
  }
};

// Exclui uma subcategoria pelo ID
const deleteSubcategory = async (req, res) => {
  try {
      const subcategoryId = req.params.subcategoryId;

      // Remove a subcategoria pelo ID
      await Subcategory.findByIdAndRemove(subcategoryId);

      res.status(200).json({ success: true, message: 'Subcategoria excluída com sucesso.' });
  } catch (error) {
      console.error('Erro ao excluir subcategoria por ID:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

// Edita uma subcategoria pelo ID
const editSubcategory = async (req, res) => {
  try {
      const subcategoryId = req.params.subcategoryId;
      const { name } = req.body;

      // Encontra e atualiza a subcategoria pelo ID
      const updatedSubcategory = await Subcategory.findByIdAndUpdate(subcategoryId, { name }, { new: true });

      if (!updatedSubcategory) {
          return res.status(404).json({ success: false, message: 'Subcategoria não encontrada.' });
      }

      res.status(200).json({ success: true, subcategory: updatedSubcategory });
  } catch (error) {
      console.error('Erro ao editar subcategoria por ID:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};


module.exports = {
  createSubcategory,
  getSubcategories,
  deleteSubcategory, // Adiciona a função de exclusão de subcategoria
  editSubcategory, // Adiciona a função de edição de subcategoria
 

  


};

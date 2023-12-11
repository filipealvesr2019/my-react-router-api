const Category = require('../models/category'); // Substitua pelo caminho real do seu modelo
const Subcategory = require('../models/Subcategory');
const Product = require('../models/product');
// Adicionar nova categoria
const newCategory = async (req, res) => {
    try {
      // Lógica para adicionar nova categoria
      const { name } = req.body;
      const category = new Category({ name });
      await category.save();
      res.json({ success: true, category });
    } catch (error) {
      console.error('Error adding new category:', error);
      res.status(500).json({ success: false, message: 'Error adding new category' });
    }
  };
  
  // Obter todas as categorias
  const getAllCategories = async (req, res) => {
    try {
      // Lógica para obter todas as categorias
      const categories = await Category.find();
      res.json({ success: true, categories });
    } catch (error) {
      console.error('Error getting all categories:', error);
      res.status(500).json({ success: false, message: 'Error getting all categories' });
    }
  };
  
  // Obtém uma categoria pelo ID
const getCategoryById = async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId;
  
      // Use o método `populate` para preencher os documentos na matriz de subcategorias
      const category = await Category.findById(categoryId).populate('subcategories').exec();
  
      if (!category) {
        return res.status(404).json({ message: 'Categoria não encontrada.' });
      }
  
      res.status(200).json({ category });
    } catch (error) {
      console.error('Erro ao obter categoria por ID:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  };
 // Função para adicionar subcategoria a uma categoria específica
const createSubcategory = async (req, res) => {
    try {
      const { categoryId } = req.params; // Captura o ID da categoria da URL
      const { name } = req.body; // Captura o nome da subcategoria do corpo da solicitação
  
      // Verifica se a categoria existe
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
      }
  
      // Cria a subcategoria
      const subcategory = new Subcategory({ name });
      await subcategory.save();
  
      // Adiciona a subcategoria à categoria
      category.subcategories.push(subcategory);
      await category.save();
  
      res.status(201).json({ success: true, subcategory });
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  };
  
  module.exports = {
    newCategory,
    getAllCategories,
    getCategoryById,
    createSubcategory,
  };
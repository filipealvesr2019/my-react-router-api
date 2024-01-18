const Category = require('../models/category'); // Substitua pelo caminho real do seu modelo
const Subcategory = require('../models/Subcategory');
const Product = require('../models/product'); // Substitua pelo caminho real do seu modelo Product

const mongoose = require('mongoose');
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
 
// No seu arquivo categoryController.js
// ...

// Adiciona uma subcategoria a uma categoria pelo nome
// Adiciona uma subcategoria a uma categoria pelo nome
const addSubcategoryToCategory = async (req, res) => {
  try {
      const { categoryId } = req.params;
      const { name } = req.body;

      // Encontre a categoria pelo ID
      const category = await Category.findById(categoryId);

      if (!category) {
          return res.status(404).json({ message: 'Categoria não encontrada.' });
      }

      // Crie a subcategoria
      const subcategory = new Subcategory({ name });
      await subcategory.save();

      // Adicione a subcategoria à categoria
      category.subcategories.push(subcategory._id); // Utilize o _id da subcategoria
      await category.save();

      res.status(201).json({ success: true, subcategory });
  } catch (error) {
      console.error('Erro ao adicionar subcategoria à categoria:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

// Exclui uma categoria pelo ID
const deleteCategory = async (req, res) => {
  try {
      const categoryId = req.params.categoryId;

      // Remove a categoria pelo ID
      await Category.findByIdAndRemove(categoryId);

      res.status(200).json({ success: true, message: 'Categoria excluída com sucesso.' });
  } catch (error) {
      console.error('Erro ao excluir categoria por ID:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

// controllers/categoriesController.js

// ...

// Edita uma categoria pelo ID
const editCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name } = req.body;

    // Encontra e atualiza a categoria pelo ID
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
    }

    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error('Erro ao editar categoria por ID:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};





const addImageToCategory = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    // Criar um novo objeto image com _id exclusivo
    const newImage = {
      _id: new mongoose.Types.ObjectId(),
      imageUrl,
    };

    category.images.push(newImage);
    await category.save();

    res.status(200).json({ message: 'Imagem adicionada com sucesso à categoria.', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar a imagem à categoria.' });
  }
};







const deleteImage = async (req, res) => {
  try {
    const { categoryId, imageIndex } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    if (imageIndex < 0 || imageIndex >= category.images.length) {
      return res.status(400).json({ message: 'Invalid image index.' });
    }

    category.images.splice(imageIndex, 1);
    await category.save();

    res.status(200).json({ message: 'Image deleted successfully from the category.', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting the image from the category.' });
  }
};

const getImagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const images = category.images;
    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting images by category.' });
  }
};

// controllers/categoriesController.js


const updateImageURL = async (req, res) => {
  const { categoryId, imageIndex, newImageUrl } = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    if (
      imageIndex < 0 ||
      imageIndex >= category.images.length ||
      category.images[imageIndex].length === 0
    ) {
      return res.status(400).json({ message: 'Índice de imagem inválido' });
    }

    category.images[imageIndex][0].imageUrl = newImageUrl;
    await category.save();

    res.status(200).json({ message: 'URL da imagem atualizada com sucesso', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};







// Função para obter todas as categorias, subcategorias e produtos
const getAllCategoriesWithProducts = async (req, res) => {
  try {
    const { category, size } = req.query;

    const aggregationStages = [
      {
        $match: {
          category: { $exists: true, $ne: null },
        },
      },
    ];

    // Adiciona estágios de filtragem com base nos parâmetros da solicitação
    if (category) {
      aggregationStages.push({
        $match: {
          'category': { $regex: new RegExp(category, 'i') },
        },
      });
    }

    if (size) {
      // Adiciona a condição de tamanho apenas se estiver definido
      aggregationStages.push({
        $match: {
          'size': { $regex: new RegExp(size, 'i') },
        },
      });
    }

    console.log('Agregação Antes:', aggregationStages);

    const result = await Product.aggregate(aggregationStages);

    console.log('Agregação Depois:', aggregationStages);
    console.log('Category:', category);
    console.log('Size:', size);
    console.log('Aggregation Result:', result);

    const categories = result.map(product => {
      return {
        category: product.category,
        subcategory: product.subcategory,
        products: [product],
      };
    });

    res.json(categories);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





  module.exports = {
    newCategory,
    getAllCategories,
    getCategoryById,
    createSubcategory,
    addSubcategoryToCategory,
    deleteCategory, // Adiciona a função de exclusão de categoria
    editCategory, // Adiciona a função de edição de categoria
    addImageToCategory,
    deleteImage,
    getImagesByCategory,
    updateImageURL,
    getAllCategoriesWithProducts


  };
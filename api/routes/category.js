// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController'); // Substitua pelo caminho real do seu controlador

// Rota para adicionar nova categoria
router.post('/admin/category/new', categoriesController.newCategory);
router.get('/admin/categories', categoriesController.getAllCategories);
router.get('/categories/:categoryId', categoriesController.getCategoryById);
router.post('/categories/:categoryId/subcategories', categoriesController.createSubcategory);
router.post('/categories/:categoryName/subcategories', categoriesController.addSubcategoryToCategory);
router.put('/admin/categories/:categoryId', categoriesController.editCategory);

// Rota para excluir uma categoria
router.delete('/admin/categories/:categoryId', categoriesController.deleteCategory);

module.exports = router;

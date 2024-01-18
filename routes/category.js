// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController'); // Substitua pelo caminho real do seu controlador

// Rota para adicionar nova categoria
router.post('/admin/category/new', categoriesController.newCategory);
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:categoryId', categoriesController.getCategoryById);
router.post('/categories/:categoryId/subcategories', categoriesController.createSubcategory);
router.post('/categories/:categoryName/subcategories', categoriesController.addSubcategoryToCategory);
router.put('/admin/categories/:categoryId', categoriesController.editCategory);

// Rota para obter imagens de uma categoria

router.get('/categories/:categoryId/images', categoriesController.getImagesByCategory);

// Rota para atualizar uma imagem em uma categoria
router.put('/category/updateImageURL', categoriesController.updateImageURL);

// Rota para excluir uma imagem de uma categoria
router.delete('/categories/:categoryId/images/:imageIndex', categoriesController.deleteImage);

router.post('/categories/:categoryId/images', categoriesController.addImageToCategory);

// Rota para excluir uma categoria
router.delete('/admin/categories/:categoryId', categoriesController.deleteCategory);



router.get('/allCategories', categoriesController.getAllCategoriesWithProducts);





module.exports = router;

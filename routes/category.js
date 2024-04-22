// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController'); // Substitua pelo caminho real do seu controlador
const { isAuthenticated, isAdmin } = require('../middleware/middlewares.authMiddleware');


// Rota para adicionar nova categoria
router.post('/admin/category/new',isAuthenticated, isAdmin,  categoriesController.newCategory);
router.get('/categories',isAuthenticated, isAdmin, categoriesController.getAllCategories);
router.get('/categories/:categoryId', isAuthenticated, isAdmin,categoriesController.getCategoryById);
router.post('/categories/:categoryId/subcategories',isAuthenticated, isAdmin, categoriesController.createSubcategory);
router.post('/categories/:categoryName/subcategories',isAuthenticated, isAdmin, categoriesController.addSubcategoryToCategory);
router.put('/admin/categories/:categoryId', isAuthenticated, isAdmin, categoriesController.editCategory);

// Rota para obter imagens de uma categoria

router.get('/category/:categoryId/images',isAuthenticated, isAdmin, categoriesController.getImagesByCategory);

// Rota para atualizar uma imagem em uma categoria
router.put('/category/updateImageURL', isAuthenticated, isAdmin, categoriesController.updateImageURL);

// Rota para excluir uma imagem de uma categoria
router.delete('/categories/:categoryId/images/:imageIndex', isAuthenticated, isAdmin, categoriesController.deleteImage);
 

router.post('/categories/:categoryId/images',isAuthenticated, isAdmin, categoriesController.addImageToCategory);

// Rota para excluir uma categoria
router.delete('/admin/categories/:categoryId',isAuthenticated, isAdmin, categoriesController.deleteCategory);


router.get('/allCategories',   categoriesController.getAllCategoriesWithProducts);
// Rota no arquivo de roteamento


router.get('/categories/:category/mixedProducts',isAuthenticated, isAdmin, categoriesController.getMixedProductsByCategory);

  





module.exports = router;

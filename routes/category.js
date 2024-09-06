// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController'); // Substitua pelo caminho real do seu controlador
const { isAuthenticated, isAdmin } = require('../middleware/middlewares.authMiddleware');


// Rota para adicionar nova categoria
router.post('/admin/category/new',isAuthenticated, isAdmin,  categoriesController.newCategory);
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:categoryId', categoriesController.getCategoryById);
router.post('/categories/:categoryId/subcategories',isAuthenticated, isAdmin, categoriesController.createSubcategory);
router.post('/categories/:categoryName/subcategories',isAuthenticated, isAdmin, categoriesController.addSubcategoryToCategory);
router.put('/admin/categories/:categoryId',isAuthenticated, isAdmin,  categoriesController.editCategory);

// Rota para obter imagens de uma categoria

router.get('/category/:categoryId/images', categoriesController.getImagesByCategory);

// Rota para atualizar uma imagem em uma categoria
// isAuthenticated, isAdmin,slider

router.put('/category/:category/imageId/:imageId',  categoriesController.updateImageURL);

// Rota para excluir uma imagem de uma categoria
router.delete('/categories/:categoryId/images/:imageIndex', isAuthenticated, isAdmin, categoriesController.deleteImage);
 
// isAuthenticated, isAdmin,
router.post('/categories/:categoryId/images', categoriesController.addImageToCategory);

// Rota para excluir uma categoria
router.delete('/admin/categories/:categoryId',isAuthenticated, isAdmin, categoriesController.deleteCategory);


router.get('/allCategories',   categoriesController.getAllCategoriesWithProducts);
// Rota no arquivo de roteamento


router.get('/categories/:category/mixedProducts', categoriesController.getMixedProductsByCategory);
router.get('/categories/:category/:subcategory', categoriesController.getMixedProductsBySubCategory);
router.get('/category/:category/priceRange/:range', categoriesController.getMixedProductsByPriceRange);


router.get('/categories/:category/filterSizeProducts', categoriesController.getProductsBySizeAndCategory);




router.get('/category/:categoryId/images', categoriesController.getImageSlider);

// upload imagem from slider
router.post('/slider/categories/:categoryId/images', isAuthenticated, isAdmin, categoriesController.addImageToSlider);


router.put('/slider/category/:category/imageId/:imageId', isAuthenticated, isAdmin,   categoriesController.updateImageURLSlider);

// Rota para excluir uma imagem de uma categoria
router.delete('/slider/categories/:categoryId/images/:imageIndex', isAuthenticated, isAdmin,  categoriesController.deleteImageSlider);
 
// isAuthenticated, isAdmin,

// Rota para excluir uma categoria
router.delete('/slider/admin/categories/:categoryId',isAuthenticated, isAdmin, categoriesController.deleteCategory);



module.exports = router;

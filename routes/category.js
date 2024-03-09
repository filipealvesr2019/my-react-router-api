// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController'); // Substitua pelo caminho real do seu controlador

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      // Se o usuário estiver autenticado, prossiga com a solicitação
      return next();
    }
    // Se o usuário não estiver autenticado, redirecione-o para a página de login
    res.redirect('/auth/google'); // Ou qualquer URL de login que você tenha definido
  }
// Rota para adicionar nova categoria
router.post('/admin/category/new',  categoriesController.newCategory);
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:categoryId', categoriesController.getCategoryById);
router.post('/categories/:categoryId/subcategories', categoriesController.createSubcategory);
router.post('/categories/:categoryName/subcategories', categoriesController.addSubcategoryToCategory);
router.put('/admin/categories/:categoryId', categoriesController.editCategory);

// Rota para obter imagens de uma categoria

router.get('/category/:categoryId/images', categoriesController.getImagesByCategory);

// Rota para atualizar uma imagem em uma categoria
router.put('/category/updateImageURL', categoriesController.updateImageURL);

// Rota para excluir uma imagem de uma categoria
router.delete('/categories/:categoryId/images/:imageIndex', categoriesController.deleteImage);
 

router.post('/categories/:categoryId/images', categoriesController.addImageToCategory);

// Rota para excluir uma categoria
router.delete('/admin/categories/:categoryId', categoriesController.deleteCategory);


router.get('/allCategories', categoriesController.getAllCategoriesWithProducts);
// Rota no arquivo de roteamento


router.get('/categories/:category/mixedProducts', categoriesController.getMixedProductsByCategory);

  





module.exports = router;

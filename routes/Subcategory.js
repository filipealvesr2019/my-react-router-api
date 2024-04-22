// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const subcategoriesController = require('../controllers/subcategoriesController'); // Substitua pelo caminho real do seu controlador
const { isAuthenticated, isAdmin } = require('../middleware/middlewares.authMiddleware');

// Rota para adicionar nova categoria
router.post('/admin/subcategories/new',isAuthenticated, isAdmin, subcategoriesController.createSubcategory);
router.get('/admin/subcategories', subcategoriesController.getSubcategories);
router.delete('/admin/subcategories/:subcategoryId',isAuthenticated, isAdmin, subcategoriesController.deleteSubcategory);
router.put('/admin/subcategories/:subcategoryId',isAuthenticated, isAdmin, subcategoriesController.editSubcategory);



module.exports = router;

// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const subcategoriesController = require('../controllers/subcategoriesController'); // Substitua pelo caminho real do seu controlador

// Rota para adicionar nova categoria
router.post('/admin/subcategories/new', subcategoriesController.createSubcategory);
router.get('/admin/subcategories', subcategoriesController.getSubcategories);


module.exports = router;

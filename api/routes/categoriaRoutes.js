const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post("/categorias", categoriaController.createCategory)
// Rotas para categorias
router.put('/:id', categoriaController.upadateCategory);
router.delete('/:id', categoriaController.deleteCategory);
module.exports = router;
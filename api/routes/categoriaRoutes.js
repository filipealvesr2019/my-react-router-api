const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post("/categorias", categoriaController.createCategory)
// Rotas para categorias
router.post('/', categoriaController.criarCategoria);
router.get('/', categoriaController.listarCategorias);
router.get('/:id', categoriaController.obterCategoriaPorId);
router.put('/:id', categoriaController.editarCategoria);
router.delete('/:id', categoriaController.excluirCategoria);
module.exports = router;
const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');

router.get('/', subcategoriaController.getAllSubcategorias);
router.get('/:id', subcategoriaController.getSubcategoriaById);
router.post("/", subcategoriaController.criarSubcategoria)
router.post('/', subcategoriaController.criarSubcategoria);
router.get('/', subcategoriaController.listarSubcategorias);
router.get('/:id', subcategoriaController.obterSubcategoriaPorId);
router.put('/:id', subcategoriaController.editarSubcategoria);
router.delete('/:id', subcategoriaController.excluirSubcategoria);
module.exports = router;
const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');

router.get('/', subcategoriaController.getAllSubcategorias);
router.get('/:id', subcategoriaController.getSubcategoriaById);
router.post("/", subcategoriaController.criarSubcategoria)
router.put('/:id', subcategoriaController.editSubcategory);
router.delete('/:id', subcategoriaController.deleteSubcategory);
module.exports = router;
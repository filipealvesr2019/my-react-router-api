const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');

router.get('/', subcategoriaController.getAllSubcategorias);
router.get('/:id', subcategoriaController.getSubcategoriaById);
router.post("/", subcategoriaController.criarSubcategoria)
module.exports = router;
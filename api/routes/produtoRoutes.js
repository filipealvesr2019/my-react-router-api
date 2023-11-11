const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.getAllProdutos);
router.get('/:id', produtoController.getProdutoById);

module.exports = router;
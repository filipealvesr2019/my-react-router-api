const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.getAllProdutos);
router.get('/:id', produtoController.getProdutoById);

// Rotas dos produtos
router.get("/produtos", produtoController.getAllProdutos);
router.get("/produtos/:id", produtoController.getProdutoById);
router.post("/produtos", produtoController.createProduto)
router.post('/', produtoController.createProduto);



module.exports = router;
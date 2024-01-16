// routes/discountRoutes.js
const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Rota para copiar um produto
router.post('/copyProduct', productController.copyProduct);

// Rota para aplicar desconto a um produto
router.post('/applyDiscount', productController.applyDiscountToProduct);

module.exports = router;

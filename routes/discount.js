// routes/discountRoutes.js
const express = require('express');
const discountController = require('../controllers/discountController');

const router = express.Router();

// Rota para copiar um produto
router.post('/copyProduct', discountController.copyAndApplyDiscount);
// Rota para obter produtos com desconto
router.get('/ofertas', discountController.getDiscountedProducts);

// Rota para aplicar desconto a um produto
router.post('/applyDiscount', discountController.applyDiscountToProduct);

module.exports = router;

// routes/discountRoutes.js
const express = require('express');
const discountController = require('../controllers/discountController');

const router = express.Router();

// Rota para copiar um produto
router.post('/copyProduct', discountController.copyAndApplyDiscount);
// Rota para obter produtos com desconto
router.get('/ofertas', discountController.getDiscountedProducts);
router.delete('/delete/productOffer/:productId', discountController.deleteDiscountedProduct);


module.exports = router;

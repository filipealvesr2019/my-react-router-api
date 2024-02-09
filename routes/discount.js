// routes/discountRoutes.js
const express = require('express');
const discountController = require('../controllers/discountController');

const router = express.Router();

// Rota para copiar um produto
router.post('/copyProduct', discountController.copyAndApplyDiscount);
// Rota para obter produtos com desconto
router.get('/maxDiscount', discountController.getProductsByMaxDiscount);
router.delete('/delete/productOffer/:productId', discountController.deleteDiscountedProduct);
router.get('/discountedProductsBySubcategory', discountController.getDiscountedProductsBySubcategory);

module.exports = router;

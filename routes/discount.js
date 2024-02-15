// routes/discountRoutes.js
const express = require('express');
const discountController = require('../controllers/discountController');

const router = express.Router();

// Rota para copiar um produto
router.post('/copyProduct', discountController.copyAndApplyDiscount);
// Rota para obter produtos com desconto
router.delete('/delete/productOffer/:productId', discountController.deleteDiscountedProduct);
router.get('/discountedProductsBySubcategory', discountController.getDiscountedProductsBySubcategory);
router.get('/specificDiscount/:percentage', discountController.getProductsBySpecificDiscount);
router.post('/banner', discountController.createBanner);
router.get('/bannerByDiscount/:discount', discountController.getBannersByDiscount);
router.get('/productsByDiscountPercentage/:percentage', discountController.getProductsByDiscountPercentage);
router.get('/products/discount/:percentage/category/:category', discountController.getProductsByDiscountAndCategory);

module.exports = router;

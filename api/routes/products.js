const express = require("express");
const router = express.Router();
const protect = require('../middleware/protect');
const adminAuth = require('../middleware/adminAuth');
const productController = require('../controllers/productController');
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/products").get(productController.getProducts);
router.route("/product/:id")
  .get(productController.getSingleProduct)
  .put(adminAuth, productController.updateProduct)
  .delete(adminAuth, productController.deleteProduct);

router.route("/admin/product/new").post(adminAuth, productController.newProduct);

router.route("/review")
  .put(isAuthenticatedUser, productController.createProductReview)
  .delete(isAuthenticatedUser, productController.deleteReview);

router.get("/reviews", isAuthenticatedUser, productController.getProductReviews);

router.get('/category/:categoryName', productController.getProductsByCategory);

module.exports = router;

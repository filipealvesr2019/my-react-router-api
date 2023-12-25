const express = require("express");
const router = express.Router();
const protect = require('../middleware/protect');
const adminAuth = require('../middleware/adminAuth');
const productsController = require('../controllers/productController');

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getProductsByCategory

} = require("../controllers/productController");


const { isAuthenticatedUser } = require("../middleware/auth")

router.route("/products").get( getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/admin/product/new").post( newProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,protect,adminAuth,  updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser,protect,adminAuth, deleteProduct);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.get("/reviews", isAuthenticatedUser, getProductReviews);
router.route("/review").delete(isAuthenticatedUser, deleteReview);
router.get('/products/category/:categoryId', productsController.getProductsByCategory);

// ... (outras rotas)

// Obter produtos por subcategoria
router.get('/products/subcategory/:subcategoryId', productsController.getProductsBySubcategory);

module.exports = router;

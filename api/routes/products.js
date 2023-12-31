const express = require("express");
const router = express.Router();
const protect = require('../middleware/protect');
const adminAuth = require('../middleware/adminAuth');
const productController = require('../controllers/productController'); // Corrigir o nome do controlador
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview
} = require("../controllers/productController");

const { isAuthenticatedUser } = require("../middleware/auth")
 
router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);
// Rota para criar um novo produto com upload de imagem
router.route("/admin/product/new").post(

  upload.single('image'),  // Middleware do multer para processar o upload da imagem
  newProduct
);

router.put('/:productId', productController.updateProduct);
router.route("/admin/product/:id").delete( deleteProduct);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.get("/reviews", isAuthenticatedUser, getProductReviews);
router.route("/review").delete(isAuthenticatedUser, deleteReview);

// ... (outras rotas)
router.get('/category/:categoryName', productController.getProductsByCategory);
// Obter produtos por subcategoria

module.exports = router;

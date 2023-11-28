const express = require("express");
const router = express.Router();
const protect = require('../middleware/protect');
const adminAuth = require('../middleware/adminAuth');

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");


const { isAuthenticatedUser } = require("../middleware/auth")

router.route("/products").get( getProducts);
router.route("/product/:id").get(getSingleProduct);

router.route("/admin/product/new").post(isAuthenticatedUser,protect, newProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,protect,adminAuth,  updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser,protect,adminAuth, deleteProduct);

module.exports = router;

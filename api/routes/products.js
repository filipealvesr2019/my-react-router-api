const express = require("express");
const router = express.Router();
const protect = require('../middleware/protect');

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

router.route("/admin/product/new").post(isAuthenticatedUser, newProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,protect,  updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser,protect, deleteProduct);

module.exports = router;

const express = require("express");
const router = express.Router();


const {
    newOrder
} = require("../controllers/ordersController");


const { isAuthenticatedUser } = require("../middleware/auth")

router.route("/products").get( );
router.route("/product/:id").get();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/admin/product/:id").put(isAuthenticatedUser,);
router.route("/admin/product/:id").delete(isAuthenticatedUser,);

module.exports = router;

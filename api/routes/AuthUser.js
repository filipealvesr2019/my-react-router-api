const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout
} = require("../controllers/UserAuthController");
const { isAuthenticatedUser } = require("../middleware/auth")
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
module.exports = router;

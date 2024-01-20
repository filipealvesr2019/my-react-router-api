const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth")
import {adminAuth, pro} from "../middleware/adminAuth"
const {
  registerUser,
  loginUser,
  logout,
  allUsers,
  getUserDetails,
  updateAdminProfile,
  deleteAdminProfile,
  forgotPassword
} = require("../controllers/CustomerController");
const adminAuth = require("../middleware/adminAuth");
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.post('/password/forgot', forgotPassword);


router.route("/user/:id").put(updateAdminProfile, isAuthenticatedUser);
router.route("/users").get(allUsers, isAuthenticatedUser, adminAuth);
router.route("/user/:id")
.get(getUserDetails, isAuthenticatedUser)
.delete(deleteAdminProfile, isAuthenticatedUser)



module.exports = router;

const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth")

const {
  registerUser,
  loginUser,
  logout,
  allUsers,
  getUserDetails,
  updateAdminProfile,
  deleteAdminProfile
} = require("../controllers/UserAuthController");
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/admin/user/:id").put(updateAdminProfile, isAuthenticatedUser);

router.route("/admin/users").get(allUsers, isAuthenticatedUser);
router.route("/admin/user/:id")
.get(getUserDetails, isAuthenticatedUser)
.delete(deleteAdminProfile, isAuthenticatedUser)



module.exports = router;

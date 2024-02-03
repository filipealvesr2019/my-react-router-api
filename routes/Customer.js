const express = require("express");
const router = express.Router();

const {
  getCustumer,
  updateCustumer,
  deleteCustumer,
  getCustumerByUsername,
  getAllCustumers,
  loginCustumer,
  registerCustumers,
} = require("../controllers/CustomerController");
const { Custumerlogout } = require("../controllers/CustomerController");

router.get("/users", getAllCustumers);
router.post("/login/custumer", loginCustumer);

router.post("/user", registerCustumers); 
router.get("/user/:id", getCustumer);
router.put("/user/:id", updateCustumer); 
router.delete("/user/:id", deleteCustumer);
router.get("/user", getCustumerByUsername); 
router.post("/logout", Custumerlogout);

module.exports = router;


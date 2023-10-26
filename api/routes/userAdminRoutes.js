const express = require('express');
const router = express.Router();

const {  createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
  } = require('../controllers/userAdminController');

router.post('/admin',  createAdmin);
router.get('/admins', getAllAdmins);
router.get('/admin/:id', getAdminById);
router.put('/admin/:id', updateAdmin);
router.delete('/admin/:id', deleteAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee}= require('../controllers/userEmployeeController');

router.post('/employee', createEmployee);
router.get('/employees', getAllEmployees);
router.get('/employee/:id', getEmployeeById);
router.put('/employee/:id', updateEmployee);
router.delete('/employee/:id', deleteEmployee);

module.exports = router;

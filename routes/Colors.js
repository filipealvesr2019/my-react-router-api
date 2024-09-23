// Em seu arquivo de rotas (por exemplo, routes.js)
const express = require('express');
const router = express.Router();
const colorsController = require('../controllers/Colors'); // Substitua pelo caminho real do seu controlador
const { isAuthenticated, isAdmin } = require('../middleware/middlewares.authMiddleware');


// Rota para adicionar nova color isAuthenticated, isAdmin, 
router.post('/admin/new/color', colorsController.newColor);
router.get('/admin/colors', colorsController.getAllColors);
router.get('/user/colors', colorsController.userGetAllColors);


module.exports = router;

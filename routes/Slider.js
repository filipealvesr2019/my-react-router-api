const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/SliderController');



router.get('/slider/getAllImages', sliderController.getAllImages);
// Rota para atualizar a URL de uma imagem no slider
router.put('/slider/updateImage/:imageId', sliderController.updateImageInSlider);

// Rota para excluir uma imagem do slider
router.delete('/slider/deleteImage/:imageId', sliderController.deleteImageFromSlider);

// Rota para excluir uma imagem do slider
router.delete('/slider/deleteImage/:imageIndex', sliderController.deleteImageFromSlider);

module.exports = router;

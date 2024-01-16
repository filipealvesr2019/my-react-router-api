const Slider = require('../models/Slider');
const mongoose = require('mongoose');




// Adicionar uma nova imagem ao slider
// Adicionar uma nova imagem ao slider
exports.addImageToSlider = async (req, res) => {
    const { imageUrl } = req.body;
  
    try {
      // Encontrar ou criar um slider padrão (ou use a lógica desejada)
      let slider = await Slider.findOne({ name: 'default' });
  
      if (!slider) {
        // Se não existir, cria um slider padrão
        slider = new Slider({ name: 'default' });
        await slider.save();
      }
  
      // Adicionar a imagem ao slider
      slider.images.push({ imageUrl });
      await slider.save();
  
      res.status(201).json({ message: 'Imagem adicionada com sucesso', slider });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
  

// Atualizar a URL de uma imagem no slider
exports.updateImageInSlider = async (req, res) => {
  const { imageId } = req.params; // Usar imageId diretamente dos parâmetros da rota
  const { newImageUrl } = req.body;

  try {
    // Encontrar ou criar um slider padrão
    let slider = await Slider.findOne({ name: 'default' });

    if (!slider) {
      // Se não existir, cria um slider padrão
      slider = new Slider({ name: 'default' });
    }

    // Encontrar a imagem no slider pelo _id
    const imageToUpdate = slider.images.find(img => img._id.toString() === imageId);

    if (imageToUpdate) {
      // Atualizar a URL da imagem no slider
      imageToUpdate.imageUrl = newImageUrl;

      // Salvar o slider apenas se o imageUrl estiver presente e não for vazio
      if (newImageUrl !== undefined && newImageUrl !== null && newImageUrl !== '') {
        await slider.save();
        res.status(200).json({ message: 'URL da imagem atualizada com sucesso', slider });
      } else {
        res.status(400).json({ message: 'A URL da imagem não pode ser vazia' });
      }
    } else {
      res.status(404).json({ message: 'Imagem não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Excluir uma imagem do slider
exports.deleteImageFromSlider = async (req, res) => {
  const { imageId } = req.params; // Usar imageId diretamente dos parâmetros da rota

  try {
    // Encontrar ou criar um slider padrão
    let slider = await Slider.findOne({ name: 'default' });

    if (!slider) {
      // Se não existir, cria um slider padrão
      slider = new Slider({ name: 'default' });
    }

    // Encontrar a imagem no slider pelo _id e removê-la
    const imageIndexToRemove = slider.images.findIndex(img => img._id.toString() === imageId);

    if (imageIndexToRemove !== -1) {
      slider.images.splice(imageIndexToRemove, 1);
      await slider.save();
      res.status(200).json({ message: 'Imagem excluída com sucesso', slider });
    } else {
      res.status(404).json({ message: 'Imagem não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};





  
// Obter todas as imagens do slider
exports.getAllImages = async (req, res) => {
    try {
      const sliders = await Slider.find();
      const allImages = sliders.map(slider => slider.images).flat(); // Flatten the array of arrays
  
      res.status(200).json({ images: allImages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
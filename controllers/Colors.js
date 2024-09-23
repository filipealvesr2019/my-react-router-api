const Color = require('../models/Colors'); // Substitua pelo caminho real do seu modelo

// Adicionar nova categoria
const newColor = async (req, res) => {
    try {
      // Lógica para adicionar nova categoria
      const { name, color } = req.body;
      const newColor = new Color({ name, color });
      await newColor.save();
      res.json({ success: true, newColor });
    } catch (error) {
      console.error('Error adding new color:', error);
      res.status(500).json({ success: false, message: 'Error adding new category' });
    }
  };
  
  // Obter todas as categorias
  const getAllColors = async (req, res) => {
    try {
      // Lógica para obter todas as categorias
      const colors = await Color.find();
      res.json({ success: true, colors });
    } catch (error) {
      console.error('Error getting all colors:', error);
      res.status(500).json({ success: false, message: 'Error getting all colors' });
    }
  };

  
  const userGetAllColors = async (req, res) => {
    try {
      // Lógica para obter todas as categorias
      const colors = await Color.find();
      res.json({ success: true, colors });
    } catch (error) {
      console.error('Error getting all colors:', error);
      res.status(500).json({ success: false, message: 'Error getting all colors' });
    }
  };
  

// Rota no arquivo de roteamento

  module.exports = {
    newColor,
    getAllColors,
    userGetAllColors
 


  };
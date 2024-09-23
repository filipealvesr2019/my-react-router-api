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
  


// Função para excluir uma cor
const deleteColor = async (req, res) => {
    const { id } = req.params; // Obtém o ID da cor a ser excluída
  
    try {
      const deletedColor = await Color.findByIdAndDelete(id);
      
      if (!deletedColor) {
        return res.status(404).json({ success: false, message: 'Cor não encontrada' });
      }
  
      res.json({ success: true, message: 'Cor excluída com sucesso', deletedColor });
    } catch (error) {
      console.error("Erro ao excluir a cor:", error);
      res.status(500).json({ success: false, message: 'Erro ao excluir a cor' });
    }
  };

  module.exports = {
    newColor,
    getAllColors,
    userGetAllColors,
    deleteColor
 


  };
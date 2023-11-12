const Categoria = require('../models/Categoria');

exports.getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().populate('subcategorias');
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

exports.getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id).populate('subcategorias');
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar categoria por ID' });
  }
};

exports.createCategory = async (req, res) =>{
  try{
    const newCategory = await Categoria.create(req.body);
    res.json(newCategory)
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Erro so criar categoria"})

  }

}
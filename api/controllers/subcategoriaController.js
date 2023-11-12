const Subcategoria = require('../models/Subcategoria');

exports.getAllSubcategorias = async (req, res) => {
  try {
    const subcategorias = await Subcategoria.find();
    res.json(subcategorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar subcategorias' });
  }
};

exports.getSubcategoriaById = async (req, res) => {
  try {
    const subcategoria = await Subcategoria.findById(req.params.id);
    res.json(subcategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar subcategoria por ID' });
  }
};

exports.criarSubcategoria = async (req,  res) =>{
  try{
    const novaSubcategoria = await Subcategoria.create(req.body);
    res.json(novaSubcategoria)
  }catch(error){
    console.error(error);
    res.status(500).json({error:" Erro ao criar subcategoria"})

  }


}

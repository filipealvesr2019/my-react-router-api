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


exports.editSubcategory = async (req, res) =>{
  try{
    const updatedSubcategory = await Subcategoria.findByIdAndUpdate(
      req.params.id,
      req.body,{
        new:true
      }
    )
    res.json(updatedSubcategory)
  }catch(error){
    console.error(error)
    res.status(500).json({error:'Erro ao editar subcategoria'})
  }
} 

exports.deleteSubcategory = async (req, res) =>{
  try{
    await Subcategoria.findByIdAndDelete(req.params.id);
    res.json({message:"Subcategoria excluída com sucesso"})

  }catch(error){
    console.error(error);
    res.status(500).json({error:"Erro ao excluir subcategoria"})
    

  }
}

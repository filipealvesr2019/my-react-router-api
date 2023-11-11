const Produto = require('../models/produto');

exports.getAllProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find().populate('categoria').populate('subcategoria');
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.getProdutoById = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id).populate('categoria').populate('subcategoria');
    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produto por ID' });
  }
};
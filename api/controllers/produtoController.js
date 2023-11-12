const Produto = require('../models/produto');
const Categoria = require('../models/Categoria');
const Subcategoria = require('../models/Subcategoria');
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


// Rota para criar um novo produto
exports.createProduct = async (req, res) => {
  // Extrair dados do corpo da requisição
  const { nome, fotos,descricao, tamanho, cor, categoria, subcategoria } = req.body;

  try {
    const categoriaObj = await Categoria.findOne({ nome: categoria });
    const subcategoriaObj = await Subcategoria.findOne({ nome: subcategoria });

    if (!categoriaObj || !subcategoriaObj) {
      return res.status(404).json({ error: 'Categoria ou subcategoria não encontrada' });
    }

    // Converter a string de fotos para um array
    const fotosArray = fotos.split(',');
    // Criar uma nova instância do modelo Produto
    const newProduct = new Produto({
      nome,
      fotos: fotosArray,
      descricao,
      tamanho,
      cor,
      categoria: categoriaObj._id, // Usar o ID da categoria encontrada
      subcategoria: subcategoriaObj._id, // Usar o ID da subcategoria encontrada
    });

    // Salvar o novo produto no banco de dados
    const productSave = await newProduct.save();

    // Retornar o produto recém-criado como resposta
    res.status(201).json(productSave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

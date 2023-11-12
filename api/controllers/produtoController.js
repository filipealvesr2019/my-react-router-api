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


// Rota para criar um novo produto
exports.createProduto = async (req, res) => {
  // Extrair dados do corpo da requisição
  const { nome, fotos, tamanho, cor, categoria, subcategoria } = req.body;

  try {
    // Criar uma nova instância do modelo Produto
    const novoProduto = new Produto({
      nome,
      fotos,
      tamanho,
      cor,
      categoria,
      subcategoria,
    });

    // Salvar o novo produto no banco de dados
    const produtoSalvo = await novoProduto.save();

    // Retornar o produto recém-criado como resposta
    res.status(201).json(produtoSalvo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

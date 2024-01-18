const Product = require("../models/product");
const axios = require("axios"); // Certifique-se de que o caminho do modelo está correto
const cron = require('node-cron');
const APIFeatures = require("../utils/APIFeatures");

// Controlador para criar um novo produto
exports.newProduct = async (req, res, next) => {
  try {
    // Cria uma instância do modelo com os dados recebidos
    const product = new Product(req.body);

    // Salva o produto no banco de dados
    await Product.insertMany([product]);

    console.log("Produto salvo no banco de dados.");
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Erro ao salvar o produto no banco de dados:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

// mostrar produtos => /api/products
// mostrar produtos => /api/products


// mostrar produtos => /api/products
// mostrar produtos => /api/products
// Modify the getProducts controller
exports.getProducts = async (req, res, next) => {
  try {
    const resPerPage = 10;
    const currentPage = Number(req.query.page) || 1;
    const { keyword } = req.query;

    // Lógica para calcular totalPages (total de itens / itens por página)
    let totalItems, totalPages;
    if (keyword) {
      // Count all products matching the search term
      totalItems = await Product.countDocuments({
        name: { $regex: new RegExp(keyword, 'i') },
      });
      totalPages = Math.ceil(totalItems / resPerPage);
    } else {
      // Count all products
      totalItems = await Product.countDocuments({});
      totalPages = Math.ceil(totalItems / resPerPage);
    }

    // Consultar produtos com os filtros aplicados
    const apiFeatures = new APIFeatures(Product.find({}), req.query)
      .search()
      .filter();

    // Apply pagination only if a search term is not provided
    if (!keyword) {
      apiFeatures.pagination(resPerPage);
    }

    const products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      resPerPage,
      totalPages,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



// mostrar produto especifico por id => /api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Produto não encontrado",
    });
  }
  res.status(200).json({
    success: true,
    product,
  });
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = req.body;

    // Use mongoose to find and update the product
    const result = await Product.findByIdAndUpdate(productId, updatedProduct, {
      new: true,
    });

    res.json(result);
    
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// deletar produtos => /api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(400).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Produto deletado com sucesso",
      data: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar Produto",
      error: error.message,
    });
  }
};

// criar/atualisar novo review => /api/review
exports.createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: "id do Produto não existe",
    });
  }
  const isReviewed =
    Array.isArray(product.reviews) &&
    product.reviews.find(
      (r) => r && r.user && r.user.toString() === req.user._id.toString()
    );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.Comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / product;
  review.length;

  await product.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    message: "review enviado com sucesso",
  });
};

// mostrar lista de reviews /api/reviews
// mostrar lista de reviews /api/reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Erro produto nao encontrado com esse id.",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews || [],
    });
  } catch (error) {
    console.error("Erro ao obter avaliações do produto: ", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor ao obter avaliações do produto.",
    });
  }
};
exports.deleteReview = async (req, res, next) => {
  try {
    const productId = req.query.id; // Captura o 'id' da consulta

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Erro: produto não encontrado com esse ID.",
      });
    }

    // Restante do seu código...

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Erro ao excluir avaliação do produto: ", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor ao excluir avaliação do produto.",
    });
  }
};









// Função para obter todos os produtos de uma categoria com subcategorias
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoria = req.params.categoria; // Supondo que a categoria é passada como um parâmetro na URL

    // Encontrar produtos da categoria principal e suas subcategorias
    const produtos = await Product.find({
      $or: [
        { category: { $regex: new RegExp(categoria, 'i') } }, // Case-insensitive match
        { subcategory: { $regex: new RegExp(categoria, 'i') } }, // Case-insensitive match
      ],
    }).select('-variations'); // Removendo 'variations' por simplicidade

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};













// Função para obter produtos por palavra-chave
exports.getProductsByKeyword = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: 'Palavra-chave não fornecida' });
    }

    const regex = new RegExp(keyword, 'i');

    const products = await Product.find({ name: regex });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Controlador para adicionar uma nova cor a um produto existente
exports.addColorToProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Encontra o produto pelo ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Extrai os dados da nova cor do corpo da requisição
    const { color, urls } = req.body;

    // Adiciona a nova cor às variações do produto
    product.variations.push({ color, urls });

    // Atualiza a data de modificação do produto
    product.lastModifiedAt = new Date();

    // Salva as alterações no banco de dados
    await product.save();

    console.log('Nova cor adicionada ao produto.');

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Erro ao adicionar cor ao produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};







// Controlador para excluir uma cor específica de um produto
exports.deleteColorFromProduct = async (req, res, next) => {
  try {
    const { productId, color } = req.params;

    // Encontre o produto pelo ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.',
      });
    }

    // Remova a cor do array de variações do produto
    product.variations = product.variations.filter((variation) => variation.color !== color);

    // Salve as alterações no banco de dados
    await product.save();

    res.status(200).json({
      success: true,
      message: `Cor ${color} excluída com sucesso do produto ${productId}.`,
    });
  } catch (error) {
    console.error('Erro ao excluir cor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.',
    });
  }
};




exports.addUrlToColor = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const colorName = req.params.colorName;
    const { url } = req.body;
    console.log('Recebendo requisição para adicionar URL:', productId, colorName, url);

    // Restante do código...
    
    console.log('Nova URL adicionada à cor do produto.');
    
    // Validar se a URL está presente na solicitação
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'A URL é obrigatória',
      });
    }

    // Encontrar o produto pelo ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Encontrar a variação específica pela cor
    const variation = product.variations.find((v) => v.color === colorName);

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Cor não encontrada no produto',
      });
    }

    // Adicionar a nova URL à variação
    variation.urls.push(url);

    // Atualizar a data de modificação do produto
    product.lastModifiedAt = new Date();

    // Salvar as alterações no banco de dados
    await product.save();

    console.log('Nova URL adicionada à cor do produto.');

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Erro ao adicionar nova URL à cor do produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};














exports.deleteUrlFromColor = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const colorName = req.params.colorName;
    const urlId = req.params.urlId;

    // Encontrar o produto pelo ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Encontrar a variação específica pela cor
    const variation = product.variations.find((v) => v.color === colorName);

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Cor não encontrada no produto',
      });
    }

    // Verificar se o índice da URL está dentro dos limites
    if (urlId < 0 || urlId >= variation.urls.length) {
      return res.status(400).json({
        success: false,
        message: 'Índice de URL inválido',
      });
    }

    // Remover a URL pelo índice
    variation.urls.splice(urlId, 1);

    // Atualizar a data de modificação do produto
    product.lastModifiedAt = new Date();

    // Salvar as alterações no banco de dados
    await product.save();

    console.log('URL removida da cor do produto.');

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Erro ao remover URL da cor do produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};




exports.listNewArrivals = async (req, res) => {
  try {
    // Find the latest added products
    const newArrivals = await Product.find().sort('-createdAt').limit(5); // Limiting to 5 for example, adjust as needed
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching new arrivals' });
  }
};








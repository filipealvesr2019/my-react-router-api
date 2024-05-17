const Product = require("../models/product");
const axios = require("axios"); // Certifique-se de que o caminho do modelo está correto
const cron = require("node-cron");
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
        name: { $regex: new RegExp(keyword, "i") },
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

exports.getSingleProductForCustomer = async (req, res, next) => {
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
        { category: { $regex: new RegExp(categoria, "i") } }, // Case-insensitive match
        { subcategory: { $regex: new RegExp(categoria, "i") } }, // Case-insensitive match
      ],
    }).select("-variations"); // Removendo 'variations' por simplicidade

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
      return res.status(400).json({ message: "Palavra-chave não fornecida" });
    }

    const regex = new RegExp(keyword, "i");

    const products = await Product.find({ name: regex });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para adicionar uma nova cor a um produto existente
exports.addVariation = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Encontra o produto pelo ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Extrai os dados da nova cor do corpo da requisição
    const { color, urls, sizes } = req.body;

    // Adiciona a nova cor às variações do produto
    product.variations.push({ color, urls, sizes });

    // Atualiza a data de modificação do produto
    product.lastModifiedAt = new Date();

    // Salva as alterações no banco de dados
    await product.save();

    console.log("Nova cor adicionada ao produto.");

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Erro ao adicionar cor ao produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

// Controlador para excluir uma cor específica de um produto
exports.deleteVariation = async (req, res, next) => {
  try {
    const { productId, color } = req.params;

    // Encontre o produto pelo ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    // Remova a cor do array de variações do produto
    product.variations = product.variations.filter(
      (variation) => variation.color !== color
    );

    // Salve as alterações no banco de dados
    await product.save();

    res.status(200).json({
      success: true,
      message: `Cor ${color} excluída com sucesso do produto ${productId}.`,
    });
  } catch (error) {
    console.error("Erro ao excluir cor:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
    });
  }
};

exports.addUrlToColor = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const colorName = req.params.colorName;
    const { url } = req.body;
    console.log(
      "Recebendo requisição para adicionar URL:",
      productId,
      colorName,
      url
    );

    // Restante do código...

    console.log("Nova URL adicionada à cor do produto.");

    // Validar se a URL está presente na solicitação
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "A URL é obrigatória",
      });
    }

    // Encontrar o produto pelo ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Encontrar a variação específica pela cor
    const variation = product.variations.find((v) => v.color === colorName);

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: "Cor não encontrada no produto",
      });
    }

    // Adicionar a nova URL à variação
    variation.urls.push(url);

    // Atualizar a data de modificação do produto
    product.lastModifiedAt = new Date();

    // Salvar as alterações no banco de dados
    await product.save();

    console.log("Nova URL adicionada à cor do produto.");

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Erro ao adicionar nova URL à cor do produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
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
        message: "Produto não encontrado",
      });
    }

    // Encontrar a variação específica pela cor
    const variation = product.variations.find((v) => v.color === colorName);

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: "Cor não encontrada no produto",
      });
    }

    // Verificar se o índice da URL está dentro dos limites
    if (urlId < 0 || urlId >= variation.urls.length) {
      return res.status(400).json({
        success: false,
        message: "Índice de URL inválido",
      });
    }

    // Remover a URL pelo índice
    variation.urls.splice(urlId, 1);

    // Atualizar a data de modificação do produto
    product.lastModifiedAt = new Date();

    // Salvar as alterações no banco de dados
    await product.save();

    console.log("URL removida da cor do produto.");

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Erro ao remover URL da cor do produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

exports.listNewArrivals = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
  const perPage = 5; // Número de produtos por página
  const startIndex = (page - 1) * perPage; // Índice inicial do produto
  try {
    // Contar o total de produtos com quantidade maior que zero
    const totalProducts = await Product.countDocuments({});

    // Encontrar os produtos da página atual com quantidade maior que zero
    const newArrivals = await Product.find({ inStock: true })
      .sort("-createdAt")
      .skip(startIndex)
      .limit(perPage);

    res.json({
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / perPage),
      newArrivals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching new arrivals" });
  }
};

// Controller para obter produtos com base no tamanho, categoria, subcategoria, cor e faixa de preço
// Controller para obter produtos com base no tamanho, categoria, subcategoria, cor e faixa de preço
exports.getProductsByFilter = async (req, res) => {
  try {
    const { size, category, subcategory, color, priceRange } = req.query;

    console.log("Tamanhos:", size);
    console.log("Categoria:", category);
    console.log("Subcategoria:", subcategory);
    console.log("Cor:", color);
    console.log("Faixa de Preço:", priceRange);

    const filter = {}; // Adiciona a condição para filtrar produtos com quantidade maior que zero

    if (size) {
      filter.size = new RegExp(`\\b${size}\\b`);
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(parseFloat);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (color) {
      filter["variations.color"] = new RegExp(`\\b${color}\\b`, "i");
    }

    if (subcategory) {
      // Remova espaços em branco extras ao redor da subcategoria
      const cleanedSubcategory = subcategory.trim();
      filter.subcategory = new RegExp(`\\b${cleanedSubcategory}\\b`, "i"); // 'i' torna a busca case-insensitive
    } else if (category) {
      filter.category = new RegExp(`\\b${category}\\b`);
    }

    console.log("Filtro aplicado:", filter);

    const products = await Product.find(filter);

    console.log("Produtos encontrados:", products);

    res.json(products);
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Controller para obter subcategorias com base na categoria
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Certifique-se de que a categoria seja fornecida
    if (!category) {
      return res.status(400).json({ error: "Parâmetro de categoria ausente" });
    }

    // Filtrar subcategorias com base na categoria
    const subcategories = await Product.distinct("subcategory", {
      category: new RegExp(`\\b${category}\\b`, "i"), // 'i' torna a busca case-insensitive
    });

    res.json(subcategories);
  } catch (error) {
    console.error("Erro ao obter subcategorias:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// No controlador (controller)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { size, subcategory, color, priceRange } = req.query;

    console.log("Categoria Nome:", categoryName);
    console.log("Tamanhos:", size);
    console.log("Subcategoria:", subcategory);
    console.log("Cor:", color);
    console.log("Faixa de Preço:", priceRange);

    const filter = {};

    if (size) {
      filter.size = new RegExp(`\\b${size}\\b`, "i");
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(parseFloat);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (color) {
      filter["variations.color"] = new RegExp(`\\b${color}\\b`, "i");
    }

    if (subcategory) {
      const cleanedSubcategory = subcategory.trim();
      filter.category = categoryName;
      filter.subcategory = new RegExp(`\\b${cleanedSubcategory}\\b`, "i");
    } else {
      filter.category = categoryName;
    }

    console.log("Filtro aplicado:", filter);

    const products = await Product.find(filter);

    console.log("Produtos encontrados:", products);

    res.json(products);
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
exports.getColorsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    console.log("Categoria recebida:", category);

    const colors = await Product.distinct("variations.color", {
      category: category,
    });

    console.log("Cores encontradas:", colors);

    res.json(colors);
  } catch (error) {
    console.error("Erro ao obter cores por categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

exports.getSizesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    // Verificar se há produtos
    if (products.length === 0) {
      console.log('Não há produtos para a categoria específica.');
      res.json([]); // Retorna uma lista vazia se não houver produtos
      return;
    }

    // Obter tamanhos únicos de todas as variações de todos os produtos
    const sizes = products.flatMap(product =>
      product.variations.flatMap(variation =>
        variation.sizes.map(size => size.size)
      )
    );

    // Filtrar tamanhos únicos
    const uniqueSizes = [...new Set(sizes)];

    res.json(uniqueSizes);
  } catch (error) {
    console.error("Erro ao obter tamanhos por categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Função para obter faixas de preço com base no mínimo e máximo

// Função para obter faixas de preço com base no mínimo e máximo
function generatePriceRangesWithProducts(min, max, step, prices) {
  const ranges = [];

  for (let i = min; i < max; i += step) {
    const nextStep = Math.min(i + step - 0.01, max);
    const rangeLabel = `R$ ${i.toFixed(2)} - R$ ${nextStep.toFixed(2)}`;

    // Verificar se existe algum preço dentro do intervalo atual
    const hasProductsInRange = prices.some(price => price >= i && price <= nextStep);

    if (hasProductsInRange) {
      ranges.push(rangeLabel);
    }
  }

  return ranges;
}

// Função para obter faixas de preço com base na categoria
exports.getPriceRangesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Consulta para incluir apenas produtos da categoria específica e em estoque
    const products = await Product.find({ category, inStock: true });

    console.log("Products for category:", products);

    // Verificar se há produtos
    if (!products || products.length === 0) {
      console.log("Não há produtos para a categoria específica.");
      const defaultMinPrice = 0;
      const defaultMaxPrice = 100;
      const step = 50;
      const priceRanges = generatePriceRangesWithProducts(defaultMinPrice, defaultMaxPrice, step, []);
      console.log("Price Ranges:", priceRanges);
      res.json(priceRanges);
      return;
    }

    // Encontrar valores mínimo e máximo dos preços dos produtos
    const allPrices = products.flatMap(product =>
      product.variations.flatMap(variation =>
        variation.sizes
          .filter(size => size.quantityAvailable > 0)
          .map(size => size.price)
      )
    );

    // Verificar se há preços
    if (allPrices.length === 0) {
      console.log("Não há preços para os produtos nesta categoria.");
      const defaultMinPrice = 0;
      const defaultMaxPrice = 100;
      const step = 50;
      const priceRanges = generatePriceRangesWithProducts(defaultMinPrice, defaultMaxPrice, step, []);
      console.log("Price Ranges:", priceRanges);
      res.json(priceRanges);
      return;
    }

    const minPrice = Math.floor(Math.min(...allPrices));
    const maxPrice = Math.ceil(Math.max(...allPrices));
    console.log("Min Price:", minPrice);
    console.log("Max Price:", maxPrice);

    const step = 50; // Ajuste conforme necessário
    const priceRanges = generatePriceRangesWithProducts(minPrice, maxPrice, step, allPrices);
    console.log("Generated Price Ranges:", priceRanges);

    res.json(priceRanges);
  } catch (error) {
    console.error("Erro ao obter faixas de preço por categoria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
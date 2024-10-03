const express = require("express");
const router = express.Router();
const Product = require("../models/product")
const productController = require('../controllers/productController'); // Corrigir o nome do controlador

const {
  getProducts,
  newProduct,
  getSingleProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getSingleProductForCustomer
  
} = require("../controllers/productController");
const { isAuthenticated, isAdmin } = require("../middleware/middlewares.authMiddleware");



router.route("/products").get( isAuthenticated, isAdmin, getProducts);
router.route("/product/:id").get(getSingleProduct);
// Rota para criar um novo produto com upload de imagem
router.route("/product/:name/:id").get(getSingleProductForCustomer);


router.post("/admin/product/new",   productController.newProduct);




// router.route("/admin/product/:id").delete(addUserDataToRequest, checkPermissions(["administrador"]), deleteProduct);



router.put('/update/product/:productId', productController.updateProduct);
router.route("/admin/product/:id").delete(isAuthenticated, isAdmin,  deleteProduct);
router.route("/review").put( createProductReview);
router.get("/reviews", getProductReviews);
router.route("/review").delete(deleteReview);
router.get('/products/search', productController.getProductsByKeyword);
router.post('/product/:productId/add-variation', productController.addVariation);


router.post('/product/:productId/color/:colorName/add-url', productController.addUrlToColor);

// Rota para excluir uma URL de uma cor específica
router.delete('/product/:productId/color/:colorName/url/:urlId', productController.deleteUrlFromColor);

// Rota para excluir uma cor completa de um produto
router.delete('/product/:productId/color/:color',isAuthenticated, isAdmin, productController.deleteVariation);


router.get('/products/new-arrivals', productController.listNewArrivals);

router.get("/productsFilter", productController.getProductsByFilter);
router.get('/subcategories/:category', productController.getSubcategoriesByCategory);
// Modifique a rota para tratar produtos com base na categoria e subcategoria
router.get('/subcategoriesAndProducts/:category/:subcategory', async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const page = req.query.page || 1;
    const perPage = 10; // Número de produtos por página

    const totalProducts = await Product.countDocuments({ category, subcategory,  }); // Adicione a condição para quantidade maior que zero
    const totalPages = Math.ceil(totalProducts / perPage);

    const products = await Product.find({ category, subcategory,  }) // Adicione a condição para quantidade maior que zero
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({
      products,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    console.error('Erro ao obter produtos da subcategoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




















router.get('/search/product', async (req, res) => {
  try {
    const { searchQuery, page = 1, pageSize = 10, color, size, priceRange } = req.query;

    const skip = (page - 1) * pageSize;

    let query = { inStock: true }; // Adiciona a condição para quantidade maior que zero
    if (searchQuery) {
      query.name = new RegExp(searchQuery, 'i');
    }

    if (color) {
      query['variations.color'] = new RegExp(`\\b${color}\\b`, 'i');
    }

    if (size) {
      query.size = new RegExp(`\\b${size}\\b`);
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(parseFloat);
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(pageSize));

    const totalProducts = await Product.countDocuments(query);

    // Obtenha opções de filtro diretamente da base de dados
    const uniqueColors = await Product.distinct('variations.color');
    const uniqueSizes = await Product.distinct('size');
    const priceRanges = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);
    const uniquePriceRange = priceRanges[0];

    const filterOptions = {
      colors: uniqueColors,
      sizes: uniqueSizes,
      priceRanges: uniquePriceRange,
    };

    res.json({ products, totalProducts, filterOptions });
  } catch (error) {
    console.error('Erro ao pesquisar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para paginação de produtos
router.get('/products/pagination', async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const skip = (page - 1) * pageSize;

    const products = await Product.find({})
      .skip(skip)
      .limit(parseInt(pageSize));

    res.json(products);
  } catch (error) {
    console.error('Erro na paginação de produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Rota para obter cores dinamicamente
router.get('/colors/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    console.log('Categoria recebida:', category);

    const colors = await Product.distinct('variations.color', { category });
    res.json(colors);
  } catch (error) {
    console.error('Erro ao obter cores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter tamanhos dinamicamente
router.get('/sizes/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    console.log('Categoria recebida:', category);

    const sizes = await Product.distinct('size', { category });
    res.json(sizes);
  } catch (error) {
    console.error('Erro ao obter tamanhos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter faixas de preço dinamicamente
router.get('/priceRanges/:category', async (req, res) => {
  try {
    const { category } = req.params;

    console.log('Categoria recebida:', category);

    const minMaxPrices = await Product.aggregate([
      { $match: { category } }, // Adiciona o filtro por categoria
      { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
    ]);

    const minPrice = minMaxPrices.length > 0 ? minMaxPrices[0].minPrice : 0;
    const maxPrice = minMaxPrices.length > 0 ? minMaxPrices[0].maxPrice : 0;

    const priceRanges = generatePriceRanges(minPrice, maxPrice);
    res.json(priceRanges);
  } catch (error) {
    console.error('Erro ao obter faixas de preço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// Função para gerar faixas de preço com base no mínimo e máximo
function generatePriceRanges(min, max) {
  const ranges = [];
  const step = 50; // Ajuste conforme necessário

  for (let i = min; i <= max; i += step) {
    const range = `R$ ${Math.floor(i)} - R$ ${Math.floor(i + step - 1)}`;
    ranges.push(range);
  }

  return ranges;
}











router.get('/products/category/:categoryName', productController.getProductsByCategory);


router.get('/categories/:category/colors', productController.getColorsByCategory);
router.get('/categories/:category/sizes', productController.getSizesByCategory);
router.get('/category/:category/priceRange', productController.getPriceRangesByCategory);


router.get("/all-products", async (req, res) => {
  try {
    const products = await Product.find(); // Busca todos os produtos
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter produtos",
    });
  }
});

const formatProductNameForURL = (name) => {
  return name
    .normalize("NFD") // Normaliza a string para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
    .toLowerCase() // Converte para letras minúsculas
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/[^\w\-]+/g, ""); // Remove caracteres não alfanuméricos (exceto hífens)
};



// Rota para gerar o feed de produtos
router.get('/feed', async (req, res) => {
  try {
    // Buscar os produtos no MongoDB
    const products = await Product.find();

    // Criar o XML do feed
    let xmlFeed = `
      <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
        <channel>
          <title>Seu Site</title>
          <link>https://mediewal.com.br</link>
          <description>Feed de Produtos</description>
    `;

    // Iterar sobre os produtos e adicionar ao feed
    products.forEach(product => {
      // Iterar sobre as variações para cada produto
      product.variations.forEach(variation => {
        // Iterar sobre os tamanhos de cada variação
        variation.sizes.forEach(size => {
          xmlFeed += `
            <item>
              <g:id>${product._id}-${size.size}</g:id> <!-- ID único para cada variação de tamanho -->
              <g:title><![CDATA[${product.name} - ${size.size}]]></g:title>
              <g:description><![CDATA[${product.description}]]></g:description>
              <g:link>https://mediewal.com.br/products/${formatProductNameForURL(product.name)}/${product._id}</g:link>
              <g:image_link>${variation.urls[0]}</g:image_link> <!-- Usar a primeira imagem da variação -->
              <g:price>${size.price} BRL</g:price>
              <g:availability>${size.quantityAvailable > 0 ? 'in stock' : 'out of stock'}</g:availability>
            </item>
          `;
        });
      });
    });

    xmlFeed += `</channel></rss>`;

    // Enviar o XML gerado como resposta
    res.set('Content-Type', 'application/xml');
    res.send(xmlFeed);
  } catch (error) {
    console.error('Erro ao gerar o feed:', error);
    res.status(500).send('Erro no servidor.');
  }
});


module.exports = router;

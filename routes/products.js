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
  deleteReview
} = require("../controllers/productController");

const { isAuthenticatedUser } = require("../middleware/auth");


router.route("/products").get( getProducts);
router.route("/product/:id").get(getSingleProduct);
// Rota para criar um novo produto com upload de imagem
router.route("/admin/product/new").post(

  newProduct
);



const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : null;

    console.log('Papel do usuário:', userRole);
    console.log('Papéis permitidos:', allowedRoles);

    if (!userRole) {
      console.log('Token inválido ou ausente. Permissão negada.');
      return res.status(401).json({ message: "Token inválido ou ausente." });
    }

    if (allowedRoles.includes(userRole)) {
      console.log('Permissão concedida. Continuando para a próxima função.');
      next();
    } else {
      console.log('Permissão negada. Papel do usuário não autorizado.');
      return res.status(403).json({ message: "Permissão negada." });
    }
  };
};




// Função para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token ausente. Acesso não autorizado.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Adiciona as informações do usuário ao objeto de solicitação (req)
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido. Acesso não autorizado.' });
  }
};


router.put('/update/product/:productId', productController.updateProduct);
router.route("/admin/product/:id").delete(verifyToken,  checkPermissions(["administrador"]), deleteProduct);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.get("/reviews", isAuthenticatedUser, getProductReviews);
router.route("/review").delete(isAuthenticatedUser, deleteReview);
router.get('/products/search', productController.getProductsByKeyword);
router.post('/product/:productId/add-color', productController.addColorToProduct);


router.post('/product/:productId/color/:colorName/add-url', productController.addUrlToColor);

// Rota para excluir uma URL de uma cor específica
router.delete('/product/:productId/color/:colorName/url/:urlId', productController.deleteUrlFromColor);

// Rota para excluir uma cor completa de um produto
router.delete('/product/:productId/color/:color', productController.deleteColorFromProduct);


router.get('/products/new-arrivals', productController.listNewArrivals);

router.get("/productsFilter", productController.getProductsByFilter);
router.get('/subcategories/:category', productController.getSubcategoriesByCategory);
// Modifique a rota para tratar produtos com base na categoria e subcategoria
router.get('/subcategoriesAndProducts/:category/:subcategory', async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    const products = await Product.find({ category, subcategory });

    res.json(products);
  } catch (error) {
    console.error('Erro ao obter produtos da subcategoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});






// Altere a rota para incluir os parâmetros de paginação
router.get('/search/product', async (req, res) => {
  try {
    const { searchQuery, page = 1, pageSize = 10 } = req.query;

    const skip = (page - 1) * pageSize;

    let query = {};
    if (searchQuery) {
      query = { name: new RegExp(searchQuery, 'i') };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(pageSize));

    const totalProducts = await Product.countDocuments(query);

    res.json({ products, totalProducts });
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








router.get('/products/category/:categoryName', productController.getProductsByCategory);





// ... (outras rotas)

module.exports = router;

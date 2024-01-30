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
// Middleware para verificar permissões
const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : null; // Verifique se req.user está definido antes de acessar a propriedade role

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ message: "Permissão negada." });
    }
  };
};




router.put('/update/product/:productId', productController.updateProduct);
router.route("/admin/product/:id").delete(  checkPermissions(["administrador"]), deleteProduct);
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



router.get('/search/product', async (req, res) => {
  try {
    const { searchQuery } = req.query;

    // Use uma expressão regular para fazer uma pesquisa insensível a maiúsculas e minúsculas
    const products = await Product.find({ name: { $regex: new RegExp(searchQuery, 'i') } });

    res.json(products);
  } catch (error) {
    console.error('Erro ao pesquisar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});






// ... (outras rotas)

module.exports = router;

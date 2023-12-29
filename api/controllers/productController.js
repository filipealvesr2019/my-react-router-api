const Product = require("../models/product");
const Category = require('../models/category');  // Certifique-se de que o caminho do modelo está correto

const APIFeatures = require("../utils/APIFeatures");
const multer = require('multer');
  // Importe a biblioteca Cloudinary
// Configuração do Cloudinary

// Configuração do Multer para upload de imagens em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Função para fazer o upload da imagem para o ImgBB
const uploadImageToImgBB = async (imageBuffer) => {
  try {
    const response = await axios.post('https://api.imgbb.com/1/upload', {
      key: process.env.ImgBB_KEY, // Substitua com sua chave de API ImgBB
      image: imageBuffer.toString('base64'),
    });

    // A resposta conterá informações sobre a imagem enviada
    return response.data.data;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem para o ImgBB:', error.message);
    throw error;
  }
};

// Controlador para criar um novo produto
exports.newProduct = async (req, res, next) => {
  try {
    // Cria uma instância do modelo com os dados recebidos
    const product = new Product(req.body);

    // Salva o produto no banco de dados
    await product.save();

    console.log('Produto salvo no banco de dados.');
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Erro ao salvar o produto no banco de dados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

// mostrar produtos => /api/products
// mostrar produtos => /api/products
exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 8;
        let productsCount;

        // Verificar se os parâmetros de preço foram fornecidos
        let priceFilter = {};
        if (req.query.minPrice && req.query.maxPrice) {
            priceFilter = {
                price: {
                    $gte: req.query.minPrice,
                    $lte: req.query.maxPrice
                }
            };
        }

        // Contar o número total de produtos considerando os filtros
        productsCount = await Product.countDocuments(priceFilter);

        // Consultar produtos com os filtros aplicados
        const apiFeatures = new APIFeatures(Product.find(priceFilter), req.query)
            .search()
            .filter()
            .pagination(resPerPage);

        const products = await apiFeatures.query;

        res.status(200).json({
            success: true,
            productsCount,
            resPerPage,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
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

// atualisar produto => /api/v1/admin/product/:id
// Assuming you have your Product model and necessary imports

// atualisar produto => /api/v1/admin/product/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update the product with the new data
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body, // Assuming req.body contains the updated fields
      {
        new: true, // Return the modified document
        runValidators: true, // Run model validations on update
        useFindAndModify: false, // Use new MongoDB driver's update method
      }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
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

    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
  }

  const product =  await Product.findById(productId);
  if(!product){
    return res.status(404).json({
      success:false,
      error:"id do Produto não existe"
    })
  }
  const isReviewed =
  Array.isArray(product.reviews) &&
  product.reviews.find(
    (r) => r && r.user && r.user.toString() === req.user._id.toString()
  );
  if(isReviewed){
    product.reviews.forEach(review => {
      if(review.user.toString() === req.user._id.toString()){
        review.Comment = comment;
        review.rating = rating;
      }
    })

  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  }

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product;
  review.length

  await product.save({
    validateBeforeSave:false
  })

  res.status(200).json({
    success:true,
    message:"review enviado com sucesso"
  })

}



// mostrar lista de reviews /api/reviews
// mostrar lista de reviews /api/reviews
exports.getProductReviews = async (req, res, next) =>{

  
  try{
    const product =  await Product.findById(req.query.id)
    
    if(!product){
      return res.status(404).json({
        success:false,
        error:"Erro produto nao encontrado com esse id."

      })
    }

  res.status(200).json({
    success:true,
    reviews: product.reviews || [],
  })

  }
  catch(error){
    console.error("Erro ao obter avaliações do produto: ",error);
    res.status(500).json({
      success:false,
      error:"Erro interno do servidor ao obter avaliações do produto."
    })

  }
}
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
      error:
        "Erro interno do servidor ao excluir avaliação do produto.",
    });
  }
};









// Rota para obter todos os produtos de uma categoria específica por nome
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const products = await Product.find({ category: categoryName });

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'Nenhum produto encontrado para esta categoria' });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};
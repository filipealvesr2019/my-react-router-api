const Product = require("../models/product");
const APIFeatures = require("../utils/APIFeatures");

// criar produto => /api/v1/product/new
exports.newProduct = async (req, res, next) => {
  
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

// mostrar produtos => /api/v1/products
exports.getProducts = async (req, res, next) => {
    
    const resPerPage = 4;
    const productCount = await Product.countDocuments;
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)
  
    const products = await apiFeatures.query; // Chame query como uma função assíncrona

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products,
    })
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

exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Produto não encontrado",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
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

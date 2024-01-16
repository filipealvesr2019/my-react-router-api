// controllers/productController.js
const Product = require('../models/product');
const Discount = require('../models/discount');

exports.copyProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Encontrar o produto original pelo ID
    const originalProduct = await Product.findById(productId);

    if (!originalProduct) {
      return res.status(404).json({
        success: false,
        message: "Produto original não encontrado",
      });
    }

    // Copiar o produto original
    const copiedProduct = new Product({ ...originalProduct.toObject(), _id: undefined });

    // Salvar o produto copiado no banco de dados
    await copiedProduct.save();

    console.log("Produto copiado salvo no banco de dados.");

    // Retornar o ID do produto copiado
    res.status(201).json({
      success: true,
      copiedProductId: copiedProduct._id,
    });
  } catch (error) {
    console.error("Erro ao copiar o produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

exports.applyDiscountToProduct = async (req, res, next) => {
  try {
    const { copiedProductId, discountPercentage } = req.body;

    // Encontrar o produto copiado pelo ID
    const copiedProduct = await Product.findById(copiedProductId);

    if (!copiedProduct) {
      return res.status(404).json({
        success: false,
        message: "Produto copiado não encontrado",
      });
    }

    // Aplicar desconto ao preço do produto copiado
    copiedProduct.price *= 1 - discountPercentage / 100;

    // Salvar o produto com desconto no banco de dados
    await copiedProduct.save();

    console.log("Desconto aplicado ao produto copiado e salvo no banco de dados.");

    // Criar um registro de desconto associado ao produto copiado
    const discount = new Discount({
      productId: copiedProductId,
      percentage: discountPercentage,
    });
    await discount.save();

    // Retornar o produto com desconto
    res.status(200).json({
      success: true,
      discountedProduct: copiedProduct,
    });
  } catch (error) {
    console.error("Erro ao aplicar desconto ao produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

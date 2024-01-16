// controllers/discountController.js
const Product = require('../models/product');
const Discount = require('../models/discount');
const cloneDeep = require('lodash/cloneDeep');

exports.copyAndApplyDiscount = async (req, res, next) => {
  try {
    const { productId, discountPercentage } = req.body;

    // Encontrar o produto original pelo ID
    const originalProduct = await Product.findById(productId);

    if (!originalProduct) {
      return res.status(404).json({
        success: false,
        message: "Produto original não encontrado",
      });
    }

    // Criar uma cópia profunda do produto original
    const copiedProduct = cloneDeep(originalProduct.toObject());

    // Aplicar desconto ao preço do produto copiado
    const discountedPrice = copiedProduct.price * (1 - discountPercentage / 100);

    // Verificar se o preço calculado é um número válido e maior ou igual a zero
    if (!isNaN(discountedPrice) && discountedPrice >= 0) {
      copiedProduct.price = discountedPrice;

      // Remover o _id da cópia para garantir que um novo ID seja gerado ao salvar
      delete copiedProduct._id;

      // Salvar o produto copiado no banco de dados
      const savedProduct = await Product.create(copiedProduct);

      console.log("Produto copiado salvo no banco de dados com desconto aplicado:", savedProduct);

      // Criar um desconto associado ao produto copiado
      const discount = new Discount({
        productId: savedProduct._id,
        percentage: discountPercentage,
        discountedProductDetails: savedProduct,
      });

      // Salvar o desconto no banco de dados
      await discount.save();

      console.log("Documento de desconto salvo no banco de dados:", discount);

      // Retornar o ID do produto copiado
      res.status(201).json({
        success: true,
        copiedProductId: savedProduct._id,
      });
    } else {
      // Se o preço não for um número válido ou menor que zero, retornar uma resposta apropriada
      return res.status(400).json({
        success: false,
        message: "O desconto resulta em um preço inválido ou negativo.",
      });
    }
  } catch (error) {
    console.error("Erro ao copiar o produto e aplicar desconto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};





exports.getDiscountedProducts = async (req, res, next) => {
    try {
      // Encontrar todos os descontos ativos
      const discounts = await Discount.find({ percentage: { $gt: 0 } });
  
      // Obter os IDs dos produtos com desconto
      const productIds = discounts.map(discount => discount.productId);
  
      // Encontrar os produtos correspondentes
      const productsWithDiscount = await Product.find({ _id: { $in: productIds } });
  
      res.status(200).json({
        success: true,
        productsWithDiscount,
      });
    } catch (error) {
      console.error("Erro ao obter produtos com desconto:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  };






exports.deleteDiscountedProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Verificar se o produto existe
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    // Remover o produto com desconto
    await Product.findByIdAndRemove(productId);

    // Remover o desconto associado ao produto
    await Discount.findOneAndRemove({ productId });

    res.status(200).json({
      success: true,
      message: 'Produto com desconto removido com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir produto com desconto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

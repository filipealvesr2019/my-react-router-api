// controllers/discountController.js
const Product = require('../models/product');
const Discount = require('../models/discount');
const cloneDeep = require('lodash/cloneDeep');
// controllers/discountController.js


exports.copyAndApplyDiscount = async (req, res, next) => {
  try {
    const { productId, discountPercentage } = req.body;

    // Encontrar o produto original pelo ID
    const originalProduct = await Product.findById(productId);

    if (!originalProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produto original não encontrado',
      });
    }

    // Criar uma cópia profunda do produto original
    const copiedProduct = cloneDeep(originalProduct.toObject());

    // Aplicar desconto ao preço do produto copiado
    const discountedPrice = copiedProduct.price * (1 - discountPercentage / 100);

    // Verificar se o preço calculado é um número válido e maior ou igual a zero
    if (!isNaN(discountedPrice) && discountedPrice >= 0) {
      // Salvar o preço original no campo previousPrice
      copiedProduct.previousPrice = originalProduct.price;

      copiedProduct.price = discountedPrice;

      // Salvar a porcentagem de desconto no campo discountPercentage
      copiedProduct.discountPercentage = discountPercentage;

      // Remover o _id da cópia para garantir que um novo ID seja gerado ao salvar
      delete copiedProduct._id;

      // Salvar o produto copiado no banco de dados
      const savedProduct = await Product.create(copiedProduct);

      console.log('Produto copiado salvo no banco de dados com desconto aplicado:', savedProduct);

      // Criar um desconto associado ao produto copiado
      const discount = new Discount({
        productId: savedProduct._id,
        percentage: discountPercentage,
        discountedProductDetails: {
          ...savedProduct.toObject(), // Adiciona todas as propriedades do produto
          previousPrice: originalProduct.price,
        },
      });

      // Salvar o desconto no banco de dados
      await discount.save();

      console.log('Documento de desconto salvo no banco de dados:', discount);

      // Atualizar a quantidade do produto original para zero
      originalProduct.quantity = 0;
      await originalProduct.save();

      // Retornar o ID do produto copiado
      res.status(201).json({
        success: true,
        copiedProductId: savedProduct._id,
      });
    } else {
      // Se o preço não for um número válido ou menor que zero, retornar uma resposta apropriada
      return res.status(400).json({
        success: false,
        message: 'O desconto resulta em um preço inválido ou negativo.',
      });
    }
  } catch (error) {
    console.error('Erro ao copiar o produto e aplicar desconto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};


// ... outros controladores




// controllers/discountController.js

// ... outras importações

exports.getProductsByMaxDiscount = async (req, res) => {
  try {
    const discounts = await Discount.find({ percentage: { $gt: 0 } })
      .sort({ percentage: -1 })
      .limit(5);

    if (discounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum produto com desconto encontrado',
      });
    }

    const productIds = discounts.map(discount => discount.productId);

    // Buscar produtos com desconto
    const productsWithMaxDiscount = await Product.find({ _id: { $in: productIds } });

    // Ordenar produtos com base nos descontos correspondentes
    const sortedProductsWithMaxDiscount = productsWithMaxDiscount.sort((a, b) => {
      const discountA = discounts.find(d => d.productId.equals(a._id));
      const discountB = discounts.find(d => d.productId.equals(b._id));

      return discountB.percentage - discountA.percentage; // Ordenar do maior para o menor desconto
    });

    // Mapear os descontos correspondentes aos produtos
    const productsWithDiscountDetails = sortedProductsWithMaxDiscount.map(product => {
      const discount = discounts.find(d => d.productId.equals(product._id));

      return {
        ...product.toObject(),
        discountDetails: {
          percentage: discount.percentage,
          previousPrice: discount.discountedProductDetails.previousPrice,
          discountPercentage: product.discountPercentage, // Adiciona a porcentagem de desconto ao produto
        },
      };
    });

    res.status(200).json({
      success: true,
      productsWithMaxDiscount: productsWithDiscountDetails,
    });
  } catch (error) {
    console.error('Erro ao obter produtos com maiores descontos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

// ... outros controladores









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





// Função para obter produtos com desconto por subcategoria
exports.getDiscountedProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryName } = req.query;

    // Consultar o banco de dados para encontrar produtos com desconto para a subcategoria especificada
    const discountedProducts = await Product.find({ subcategory: subcategoryName, discountPercentage: { $gt: 0 } });

    res.json(discountedProducts);
  } catch (error) {
    console.error('Erro ao obter produtos com desconto por subcategoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
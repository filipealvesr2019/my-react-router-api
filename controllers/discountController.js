// controllers/discountController.js
const Product = require('../models/product');
const Discount = require('../models/discount');
const cloneDeep = require('lodash/cloneDeep');
const Banner = require('../models/Banner');
// controllers/discountController.js
// No arquivo de controlador (por exemplo, controllers/bannerController.js)

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




// Outras importações...

exports.getProductsBySpecificDiscount = async (req, res) => {
  try {
    const { percentage } = req.params;

    const discounts = await Discount.find({ percentage: parseInt(percentage) })
      .sort({ percentage: -1 });

    if (discounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Nenhum produto com ${percentage}% de desconto encontrado`,
      });
    }

    const productIds = discounts.map(discount => discount.productId);

    const productsWithSpecificDiscount = await Product.find({ _id: { $in: productIds } });

    res.status(200).json({
      success: true,
      productsWithSpecificDiscount,
    });
  } catch (error) {
    console.error('Erro ao obter produtos com desconto específico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};





exports.getProductsByDiscountPercentage = async (req, res) => {
  try {
    const { percentage } = req.params;

    // Encontrar todos os descontos com a porcentagem fornecida
    const discounts = await Discount.find({ percentage });

    // Se não houver descontos com essa porcentagem, retornar uma resposta vazia
    if (discounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Nenhum produto com ${percentage}% de desconto encontrado`,
      });
    }

    // Extrair os IDs dos produtos com desconto
    const productIds = discounts.map(discount => discount.productId);

    // Encontrar os produtos com base nos IDs extraídos
    const productsWithDiscount = await Product.find({ _id: { $in: productIds } });

    res.status(200).json({
      success: true,
      productsWithDiscount,
    });
  } catch (error) {
    console.error('Erro ao obter produtos com desconto por porcentagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};




















exports.createBanner = async (req, res) => {
  try {
    // Extrair os dados da requisição
    const { image, discount } = req.body;

    // Criar um novo banner com os dados fornecidos
    const newBanner = new Banner({
      image: image,
      discount: discount,
    });

    // Salvar o novo banner no banco de dados
    await newBanner.save();

    // Responder com sucesso
    res.status(201).json({
      success: true,
      message: 'Banner criado com sucesso',
      banner: newBanner,
    });
  } catch (error) {
    console.error('Erro ao criar o banner:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

// Função para buscar banners por desconto específico
exports.getBannersByDiscount = async (req, res) => {
  try {
    // Extrair o desconto da requisição
    const { discount } = req.params;

    // Buscar banners com o desconto especificado no banco de dados
    const banners = await Banner.find({ discount: parseInt(discount) });

    // Verificar se foram encontrados banners
    if (!banners || banners.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Nenhum banner com ${discount}% de desconto encontrado`,
      });
    }

    // Responder com os banners encontrados
    res.status(200).json({
      success: true,
      banners: banners,
    });
  } catch (error) {
    console.error('Erro ao buscar banners por desconto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
  

};

















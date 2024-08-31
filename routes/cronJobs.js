const mongoose = require("mongoose");
const cron = require("node-cron");
const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const PixQRcode = require('../models/PixQRcode')
const router = express.Router();
// Configurar o cron job para rodar a cada 3 minutos
// Configurando o cron job para rodar a cada 3 minutos
cron.schedule('*/30 * * * *', async () => {
  try {
    console.log('Executando a tarefa de exclusão de carrinhos...');
    // Exclui todos os carrinhos
    await Cart.deleteMany({});
    console.log('Todos os carrinhos foram excluídos com sucesso.');
  } catch (error) {
    console.error('Erro ao excluir os carrinhos:', error);
  }
});


// Função para atualizar o estoque
// Função para atualizar o estoque
const updateStock = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Buscar todos os pedidos com status "RECEIVED" e que ainda não tiveram o estoque atualizado
    const receivedOrders = await PixQRcode.find({ status: "RECEIVED", stockUpdated: false }).session(session);

    for (const order of receivedOrders) {
      for (const product of order.products) {
        const { productId, quantity, size, color } = product;

        // Encontrar o produto correspondente
        const foundProduct = await Product.findById(productId).session(session);
        if (foundProduct) {
          // Encontrar a variação de cor e tamanho correspondentes
          const variation = foundProduct.variations.find(v => v.color === color);
          if (variation) {
            const sizeObj = variation.sizes.find(s => s.size === size);
            if (sizeObj) {
              // Subtrair a quantidade do estoque
              sizeObj.quantityAvailable -= parseInt(quantity, 10);
            
              // Verificar se o tamanho está fora de estoque
              sizeObj.inStockSize = sizeObj.quantityAvailable <= 0;
            }
            
          }

          // Verificar se o produto ainda está em estoque
          foundProduct.inStock = foundProduct.variations.some(v => v.sizes.some(s => s.inStockSize));

          // Salvar as alterações do produto
          await foundProduct.save({ session });
        }
      }

      // Marcar o pedido como processado
      order.stockUpdated = true;
      await order.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erro ao atualizar o estoque:", error);
  }
};


// Executar a função `updateStock` a cada minuto
cron.schedule("* * * * *", updateStock);
module.exports = router;

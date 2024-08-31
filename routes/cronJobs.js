const mongoose = require("mongoose");
const cron = require("node-cron");
const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const PixQRcode = require('../models/PixQRcode');
const Boleto = require('../models/Boleto')
const CreditCardWithPaymentLink = require('../models/CreditCardWithPaymentLink')


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


// // Função para atualizar o estoque
// // Função para atualizar o estoque
// // Função genérica para atualizar o estoque
// const updateStockForOrders = async (OrderModel) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const receivedOrders = await OrderModel.find({ status: "RECEIVED", stockUpdated: false }).session(session);

//     for (const order of receivedOrders) {
//       for (const product of order.products) {
//         const { productId, quantity, size, color } = product;

//         const foundProduct = await Product.findById(productId).session(session);
//         if (foundProduct) {
//           const variation = foundProduct.variations.find(v => v.color === color);
//           if (variation) {
//             const sizeObj = variation.sizes.find(s => s.size === size);
//             if (sizeObj) {
//               sizeObj.quantityAvailable -= parseInt(quantity, 10);
//               sizeObj.inStockSize = sizeObj.quantityAvailable <= 0;
//             }
//           }

//           foundProduct.inStock = foundProduct.variations.some(v => v.sizes.some(s => s.inStockSize));
//           await foundProduct.save({ session });
//         }
//       }

//       order.stockUpdated = true;
//       await order.save({ session });
//     }

//     await session.commitTransaction();
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Erro ao atualizar o estoque:", error);
//   } finally {
//     session.endSession();
//   }
// };

// // Função que chama as funções de atualização de estoque
// const updateAllStocks = async () => {
//   await updateStockForOrders(PixQRcode);
//   await updateStockForOrders(Boleto);
//   await updateStockForOrders(CreditCardWithPaymentLink);
// };

// // Executar a função `updateAllStocks` a cada minuto
// cron.schedule("* * * * *", updateAllStocks);
module.exports = router;

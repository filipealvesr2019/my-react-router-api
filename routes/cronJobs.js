const mongoose = require("mongoose");
const cron = require("node-cron");
const express = require("express");
const Cart = require("../models/cart");
const router = express.Router();
// Configurar o cron job para rodar a cada 3 minutos
cron.schedule("*/3 * * * *", async () => {
  try {
    console.log("Executando tarefa de limpeza de carrinhos...");

    // Excluir todos os produtos dos carrinhos
    await Cart.updateMany({}, { $set: { products: [] } });

    console.log("Todos os produtos dos carrinhos foram excluídos.");
  } catch (error) {
    console.error("Erro ao limpar os carrinhos:", error);
  }
});

module.exports = router;

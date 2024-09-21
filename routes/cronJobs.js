const mongoose = require("mongoose");
const cron = require("node-cron");
const express = require("express");
const Cart = require("../models/cart");
const { SitemapStream } = require('sitemap');
const fs = require('fs');
const Product = require("../models/product");



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







// Função para gerar o sitemap
const generateSitemap = async () => {
  try {
    const products = await Product.find({});
    
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/perfil', changefreq: 'monthly', priority: 0.8 },
      { url: '/conta', changefreq: 'monthly', priority: 0.8 },
      ...products.map(category => ({
        url: `/categories/${encodeURIComponent(category.name.replace(/\s+/g, '-'))}/mixedProducts`,
        changefreq: 'weekly',
        priority: 0.6,
      })),
      ...products.map(product => ({
        url: `/products/${encodeURIComponent(product.name.replace(/\s+/g, '-'))}/${product.id}`,
        changefreq: 'weekly',
        priority: 0.7,
      })),
    ];

    const stream = new SitemapStream({ hostname: 'https://mediewal.com.br/' });

    const writeStream = fs.createWriteStream('./public/sitemap.xml');
    stream.pipe(writeStream);

    links.forEach(link => stream.write(link));
    stream.end();

    console.log('Sitemap gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar o sitemap:', error);
  }
};

// Rota para acessar o sitemap
router.get('/sitemap.xml', (req, res) => {
  res.sendFile(__dirname + '/public/sitemap.xml');
});

// Agendar a execução da função todos os dias à meia-noite
cron.schedule('0 0 * * *', () => {
  console.log('Atualizando o sitemap...');
  generateSitemap();
});

// Agendar a execução da função a cada segundo
// cron.schedule('* * * * * *', () => {
//   console.log('Atualizando o sitemap...');
//   generateSitemap();
// });

module.exports = router;

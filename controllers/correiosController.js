// controllers/correiosController.js
const correiosModel = require('../models/correiosModel');

const consultarPreco = async (req, res) => {
  try {
    const { sCepOrigem, sCepDestino, nVlPeso, nCdFormato, nVlComprimento, nVlAltura, nVlLargura, nCdServico, nVlDiametro } = req.body;

    const args = {
      sCepOrigem,
      sCepDestino,
      nVlPeso,
      nCdFormato,
      nVlComprimento,
      nVlAltura,
      nVlLargura,
      nCdServico,
      nVlDiametro,
    };
   
    const response = await correiosModel.consultarPreco(args);

    if (response && Array.isArray(response)) {
      // Se a resposta for um array, você pode manipular os dados aqui antes de enviar a resposta
      const dadosManipulados = response.map(item => ({
        Codigo: item.Codigo,
        Valor: item.Valor,
        PrazoEntrega: item.PrazoEntrega,
        // Adicione outras propriedades conforme necessário
      }));
    
      // Envie a resposta manipulada ao cliente
      res.json(dadosManipulados);
      console.log('Entrou em calcularPrecoPrazo. Args:', arguments);

    } else {
      console.error('Resposta inesperada dos Correios:', response);
      res.status(500).json({ error: 'Erro ao consultar o preço.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao consultar o preço.' });
  }
};

module.exports = {
  consultarPreco,
};

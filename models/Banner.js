const mongoose = require('mongoose');

// Definindo o esquema do banner
const bannerSchema = new mongoose.Schema({
  image: {
    type: String, // Aqui você pode definir o tipo do campo para armazenar o caminho da imagem do banner
    required: true
  },
  discount: {
    type: Number, // Aqui você pode definir o tipo do campo para armazenar o desconto do banner
    required: true
  }
});

// Criando o modelo do banner a partir do esquema
const Banner = mongoose.model('Banner', bannerSchema);
// Exportando o modelo do banner
module.exports = Banner;

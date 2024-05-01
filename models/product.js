const mongoose = require("mongoose");
const cron = require('node-cron');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Entre o nome do Produto"],
      trim: true,
      maxLength: [100, "O Produto não pode exceder 100 palavras"],
    },
    price: {
      type: Number,
      required: [true, "Digite o preço"],
      maxLength: [5, "O preço não pode exceder 5 números"],
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, "Digite a descrição"],
    },
    variations: [
      {
        color: {
          type: String,
          required: true,
        },
        urls: {
          type: [String],
          required: true,
        },
      
        size: {
          type: String,
          required: [true, "Digite o tamanho do produto"],
        },  
         QuantityPerUnit:{
          type: Number,
          default: 1,
        },
        

      },
      
    ],
  
    size: {
      type: String,
      required: [true, "Digite o tamanho do produto"],
    },
    category: {
      type: String, // Mudança: altere para String
      required: [true, "Digite a categoria do produto"],
    },
    subcategory: {
      type: String, // Mudança: altere para String
    },
   
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now,
    },
    previousPrice: {
      type: Number,
      default: null, // Você pode ajustar o valor padrão conforme necessário
    },
    discountPercentage: {
      type: Number,
      default: null, // Você pode ajustar o valor padrão conforme necessário
    },
   
  }
);



module.exports = mongoose.model("Product", productSchema);

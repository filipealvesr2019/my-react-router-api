const mongoose = require("mongoose");

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
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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
  }
);


// Adicione esta função para obter categorias, subcategorias e produtos associados
productSchema.statics.getAllCategoriesWithProducts = async function () {
  const categories = await this.distinct("category").exec();
  const categoriesWithProducts = [];

  for (const category of categories) {
    const subcategories = await this.distinct("subcategory", { category }).exec();
    const products = await this.find({ category }).exec();

    categoriesWithProducts.push({
      category,
      subcategories,
      products,
    });
  }

  return categoriesWithProducts;
};
module.exports = mongoose.model("Product", productSchema);

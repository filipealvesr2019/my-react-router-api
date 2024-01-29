const mongoose = require("mongoose");
const ProductStock = require("../../models/productStock/ProductStock")
const purchaseOrder = new mongoose.Schema({

  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductStock" },
      Nome: String,
      quantity: Number,
      pricePerUnit: Number,
      discount:Number,
      total: Number,
      // Other product fields
    },
  ],
  // Other fields for representing a purchase
});



// Adicionando um gancho (hook) para calcular o total antes de salvar o documento
purchaseOrder.pre("save", function (next) {
  this.products.forEach((product) => {
    // Calcula o total considerando a quantidade, preço por unidade e desconto
    product.total = product.quantity * product.pricePerUnit * (1 - product.discount / 100);
  });

  next();
});




purchaseOrder.pre("save", async function (next) {
  try {
    // Itera sobre os produtos na ordem de compra
    for (const product of this.products) {
      // Procura o produto correspondente no estoque
      const stockProduct = await ProductStock.findById(product.product);

      // Verifica se o produto foi encontrado
      if (!stockProduct) {
        throw new Error(`Produto não encontrado no estoque: ${product.product}`);
      }

      // Atualiza a quantidade disponível no estoque subtraindo a quantidade comprada
      stockProduct.quantity -= product.quantity;

      // Salva as alterações no estoque
      await stockProduct.save();
    }

    next();
  } catch (error) {
    // Se ocorrer um erro, repasse para o próximo middleware com o erro
    next(error);
  }
});







module.exports = mongoose.model("PurchaseOrder", purchaseOrder);

const mongoose = require("mongoose");
const ProductStock = require("../productStock/ProductStock");

const salesOrders = new mongoose.Schema({
  registrationData: [
    {
      Nature: { type: mongoose.Schema.Types.ObjectId, ref: "NatureType" },
      CFOP: Number,
      Number: Number,
      EntryDate: {
        type: Date,
        default: Date.now, // Set default value as the current date
      },
      Buyer: Number,
      Series: Number,
      Model: Number,
      IssueDate: {
        type: Date,
        default: Date.now, // Set default value as the current date
      },
      conversionOperator: {
        type: String,
        required: true,
        enum: ["Multiplicação", "Divisão"],
      },
      // Other product fields
    },
  ],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductStock" },
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
salesOrders.pre("save", function (next) {
  this.products.forEach((product) => {
    // Calcula o total considerando a quantidade, preço por unidade e desconto
    product.total = product.quantity * product.pricePerUnit * (1 - product.discount / 100);
  });
 
  next();
});




// Adicionando um gancho (hook) para atualizar o estoque ao salvar a ordem de vendas
salesOrders.pre("save", async function (next) {
  try {
    for (const product of this.products) {
      const stockProduct = await ProductStock.findById(product.product);

      if (!stockProduct) {
        throw new Error(`Produto não encontrado no estoque: ${product.product}`);
      }

      stockProduct.quantity -= product.quantity;

      await stockProduct.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model("SalesOrders", salesOrders);

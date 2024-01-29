const mongoose = require("mongoose");
const ProductStock = require("../../models/productStock/ProductStock")
const purchaseOrder = new mongoose.Schema({
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
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
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



// Adicionando um gancho (hook) para criar uma despesa correspondente antes de salvar a ordem de compra
purchaseOrder.pre('save', async function (next) {
  try {
    const Expense = mongoose.model('Expense'); // Certifique-se de ter o modelo Expense definido

    // Criar uma despesa correspondente
    const expense = new Expense({
      type: 'expense',
      description: `Compra - Ordem ${this._id}`, // Adapte conforme necessário
      totalAmount: this.totalAmount, // Suponho que você tenha um campo totalAmount na ordem de compra
      // Outros campos de despesa que você deseja preencher
    });

    // Salvar a despesa
    await expense.save();

    // Adicionar uma referência à despesa na ordem de compra
    this.expense = expense._id;

    next();
  } catch (error) {
    next(error);
  }
});




module.exports = mongoose.model("PurchaseOrder", purchaseOrder);

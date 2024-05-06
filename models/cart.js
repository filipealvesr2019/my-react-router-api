const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");

const cartSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
 products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      variationId: {
        type: Schema.Types.ObjectId, // Alterado para o tipo ObjectId
        ref: "Product.variations", // Referenciando a coleção de variações dentro de um produto
      },
      quantity: {
        type: Number,
         default: 0.0,
      },
      size: {
        type: String,
        default: " ",
      },
      color: {
        type: String,
        default: " ",
      },
      image: {
        type: String,
        default: " ",
      },
      price: {
        type: Number,
      },
      availableQuantity: {
        type: Number,
        default: 0,
        unique: true
      },
    
    },
  ],
  shippingFee: {
    type: Number,
    default: 0,
  },
  transportadora: {
    nome: {
      type: String,
    },
  },
  logo: {
    img: {
      type: String,
    },
  },
  taxPrice: {
    type: Number,
  },
  orderStatus: {
    type: String,
    default: "Processando...",
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  TotalQuantity: {
    type: Number,
    default: 0, // Definindo o valor padrão como 0
  },
  totalAmount: {
    type: Number,
    default: 0, // Definindo o valor padrão como 0
  },
  
});

// Pré-salvamento para atualizar a quantidade total de produtos no carrinho e calcular o total do carrinho
cartSchema.pre("save", async function (next) {
  try {
      console.log("Pré-salvamento iniciado...");

      let totalQuantity = 0;
      let totalPrice = 0;
      const addedProducts = {};

      for (const item of this.products) {
          totalQuantity += item.quantity;

          const productKey = `${item.productId}_${item.variationId}_${item.size}_${item.color}`;

          console.log(`Processando item: ${productKey}`);

          if (!addedProducts[productKey]) {
              addedProducts[productKey] = true;

              const product = await Product.findById(item.productId);

              if (product) {
                  console.log(`Produto encontrado para ${productKey}.`);
                  const variation = product.variations.find(variation =>
                      variation._id.toString() === item.variationId.toString()
                  );

                  if (variation) {
                      console.log(`Variação encontrada para ${productKey}.`);
                      console.log(`Preço da variação: ${variation.price}, Preço do item: ${item.price}`);

                      const size = variation.sizes.find(size => size.size === item.size);

                      if (size) {
                          console.log(`Tamanho encontrado para ${productKey}.`);
                          console.log(`Preço do tamanho ${item.size}: ${size.price}`);
                          item.price = size.price;
                          totalPrice += item.quantity * size.price;
                      } else {
                          console.log(`Tamanho não encontrado para ${productKey}.`);
                      }
                  } else {
                      console.log(`Variação não encontrada para ${productKey}.`);
                  }
              } else {
                  console.log(`Produto não encontrado para ${productKey}.`);
              }
          }
      }

      console.log("Calculando total do carrinho...");
      totalPrice += this.shippingFee || 0;
      totalPrice += this.taxPrice || 0;

      console.log("Atualizando quantidade total e preço total do carrinho...");
      this.TotalQuantity = totalQuantity;
      this.totalAmount = totalPrice;

      console.log("Pré-salvamento concluído.");
      next();
  } catch (error) {
      console.error("Erro durante o pré-salvamento:", error);
      next(error);
  }
});
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

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
// Pré-salvamento para atualizar a quantidade total de produtos no carrinho e calcular o total do carrinho
// Pré-salvamento para atualizar a quantidade total de produtos no carrinho e calcular o total do carrinho
// Pré-salvamento para atualizar a quantidade total de produtos no carrinho e calcular o total do carrinho
cartSchema.pre("save", async function (next) {
  try {
    let totalQuantity = 0;
    let totalPrice = 0;

    // Itera sobre os produtos no carrinho para calcular a quantidade total e o preço total
    for (const item of this.products) {
      totalQuantity += item.quantity;
      
      // Encontre o produto correspondente no banco de dados
      const product = await Product.findById(item.productId);

      // Verifica se o produto foi encontrado e se possui variações
      if (product && product.variations && product.variations.length > 0) {
        // Itera sobre as variações do produto para encontrar a variação correta
        for (const variation of product.variations) {
          if (variation.color === item.color && variation.size === item.size) {
            // Encontrou a variação correta, então adiciona o preço dessa variação ao preço total
            totalPrice += item.quantity * variation.price;
            break; // Sai do loop de variações
          }
        }
      } else {
        // Se não houver variações, assume o preço do produto como o preço da primeira variação
        totalPrice += item.quantity * product.price;
      }
    }

    // Adiciona as taxas ao preço total, se houverem
    if (this.shippingFee) {
      totalPrice += this.shippingFee;
    }
    if (this.taxPrice) {
      totalPrice += this.taxPrice;
    }

    console.log("Total Quantity Before Save:", totalQuantity);
    console.log("Total Price Before Save:", totalPrice);

    // Define os valores calculados nos campos TotalQuantity e totalAmount
    this.TotalQuantity = totalQuantity;
    this.totalAmount = totalPrice;

    next();
  } catch (error) {
    next(error);
  }
});


const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

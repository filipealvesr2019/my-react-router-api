const mongoose = require("mongoose");
const Product = require("../models/product");

const PixQRcodeSchema = new mongoose.Schema({
  billingType: {
    type: String,
  },
  custumerId: {
    type: String,
  },
  customer: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  value: { type: Number, required: true },
  format: {
    type: String,
    enum: ["ALL", "IMAGE", "PAYLOAD"],
  },
  createdAt: { type: Date, default: Date.now }, 
  expirationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  allowsMultiplePayments: {
    type: Boolean,
    required: true,
    default: true,
  },
  externalReference: {
    type: String,
  },
  payload: {
    type: String,
  },
  encodedImage: {
    type: String,
  },
  decodedImage: {
    type: String,
  },
  id: {
    type: String,
  },
  shippingFeeData: {
    transportadora: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    shippingFeePrice: {
      type: String,
      default: "",
    },
  },
  products: [
    {
      productId: {
        type: String,
        default: "",
      },
      quantity: {
        type: String,
        default: "",
      },
      size: {
        type: String,
        default: "",
      },
      color: {
        type: String,
        default: "",
      },
      image: {
        type: String,
        default: " ",
      },
      name: {
        type: String,
        default: " ",
      },
      price: {
        type: Number,
      },
    },
  ],
  trackingCode: { type: String },
  totalQuantity: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: "PENDING",
  },
});

// Middleware para atualizar o totalQuantity antes de salvar
PixQRcodeSchema.pre("save", async function (next) {
  try {
    const totalQuantity = this.products.reduce(
      (acc, product) => acc + parseInt(product.quantity || 0),
      0
    );
    this.totalQuantity = totalQuantity;

    for (const product of this.products) {
      const foundProduct = await Product.findById(product.productId);
      if (foundProduct) {
        product.name = foundProduct.name;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

async function updateStock(PixQRcode) {
  try {
    if (PixQRcode.status === "RECEIVED") {
      for (const item of PixQRcode.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          const variation = product.variations.find(
            (variation) => variation.color === item.color
          );
          const size = variation?.sizes.find((size) => size.size === item.size);

          if (size && size.quantityAvailable >= parseInt(item.quantity)) {
            size.quantityAvailable -= parseInt(item.quantity);
            if (size.quantityAvailable <= 0) {
              size.inStockSize = false;
            }
          } else {
            console.log(
              `Estoque insuficiente para o produto: ${product.name}, cor: ${item.color}, tamanho: ${item.size}`
            );
          }

          product.inStock = product.variations.some((variation) =>
            variation.sizes.some((size) => size.quantityAvailable > 0)
          );

          await product.save();
        }
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar o estoque:", error);
  }
}

PixQRcodeSchema.post('save', function(doc, next) {
  updateStock(doc)
    .then(() => next())
    .catch(next);
});

const PixQRcode = mongoose.model("PixQRcode", PixQRcodeSchema);

module.exports = PixQRcode;

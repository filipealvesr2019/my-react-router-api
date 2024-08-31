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
async function updateStatusAndSave(PixQRcodeId) {
  try {
    const pixQRcode = await PixQRcode.findById(PixQRcodeId);
    if (!pixQRcode) {
      console.log("PixQRcode não encontrado");
      return;
    }

    pixQRcode.status = "RECEIVED"; // Atualiza o status
    await pixQRcode.save(); // Salva e dispara o middleware

    console.log("Status atualizado e PixQRcode salvo com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar o status:", error);
  }
}

// Exemplo de uso
updateStatusAndSave("66bb7a3fef4c649276a4dc38");


// Exemplo de uso
updateStatusAndSave("66d329952c7779c39d8c6d00");

PixQRcodeSchema.post('save', function(doc, next) {
  console.log("Middleware post('save') acionado para o PixQRcode:", doc._id);
  updateStock(doc)
    .then(() => next())
    .catch(next);
});


const PixQRcode = mongoose.model("PixQRcode", PixQRcodeSchema);

module.exports = PixQRcode;

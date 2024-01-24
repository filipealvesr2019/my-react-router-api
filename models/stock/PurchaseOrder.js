const mongoose = require("mongoose");

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
      unit: Number,
      price: Number,
      discount:Number,
      total: Number,
      // Other product fields
    },
  ],
  // Other fields for representing a purchase
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrder);

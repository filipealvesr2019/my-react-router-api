const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductStock', required: true },
  type: { type: String, enum: ['PurchaseOrder', 'SalesOrders'], required: true },
  quantity: { type: Number, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  // You can add more fields as needed for additional details
});

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

module.exports = StockMovement;


const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../../models/stock/PurchaseOrder'); 
// POST route to create a new buy
router.post('/purchaseOrder', async (req, res) => {
    try {
      const newPurchaseOrder = await PurchaseOrder.create(req.body);
      res.status(201).json(newPurchaseOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // GET route to retrieve all buy records
  router.get('/purchaseOrder', async (req, res) => {
    try {
      const purchaseOrder = await PurchaseOrder.find()
        .populate('vendor')
        .populate('products.product');
  
      res.json(purchaseOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // GET route to retrieve information about a specific buy
  router.get('/purchaseOrder/:id', async (req, res) => {
    try {
      const purchaseOrder = await PurchaseOrder.findById(req.params.id)
        .populate('vendor')
        .populate('products.product');
  
      if (!purchaseOrder) {
        return res.status(404).json({ message: 'Buy not found' });
      }
  
      res.json(purchaseOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;

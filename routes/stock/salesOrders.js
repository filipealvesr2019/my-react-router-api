
const express = require('express');
const router = express.Router();
const SalesOrders = require('../../models/stock/SalesOrders'); 
// POST route to create a new buy
router.post('/salesOrders', async (req, res) => {
    try {
      const newSalesOrders = await SalesOrders.create(req.body);
      res.status(201).json(newSalesOrders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // GET route to retrieve all buy records
  router.get('/salesOrders', async (req, res) => {
    try {
      const salesOrders = await SalesOrders.find()
        .populate('vendor')
        .populate('products.product');
  
      res.json(salesOrders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // GET route to retrieve information about a specific buy
  router.get('/salesOrders/:id', async (req, res) => {
    try {
      const salesOrders = await SalesOrders.findById(req.params.id)
        .populate('vendor')
        .populate('products.product');
  
      if (!salesOrders) {
        return res.status(404).json({ message: 'Buy not found' });
      }
  
      res.json(salesOrders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;


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
  
router.get('/sales/:productId', async (req, res) => {
  try {
    const sales = await SalesOrders.find({
      'products.product': req.params.productId,
    })
      .populate('vendor')
      .populate('products.product');

    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






  

module.exports = router;

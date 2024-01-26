
const express = require('express');
const router = express.Router();
const Buy = require('../../models/buy/buy'); 
// POST route to create a new buy
router.post('/buy', async (req, res) => {
    try {
      const newBuy = await Buy.create(req.body);
      res.status(201).json(newBuy);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // GET route to retrieve all buy records
  router.get('/buy', async (req, res) => {
    try {
      const buys = await Buy.find()
        .populate('vendor')
        .populate('products.product');
  
      res.json(buys);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // GET route to retrieve information about a specific buy
  router.get('/buy/:id', async (req, res) => {
    try {
      const buy = await Buy.findById(req.params.id)
        .populate('vendor')
        .populate('products.product');
  
      if (!buy) {
        return res.status(404).json({ message: 'Buy not found' });
      }
  
      res.json(buy);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  

module.exports = router;

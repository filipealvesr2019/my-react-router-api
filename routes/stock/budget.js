
const express = require('express');
const router = express.Router();
const Budget = require('../../models/stock/budget'); 
// POST route to create a new buy
router.post('/budget', async (req, res) => {
    try {
      const newBudget = await Budget.create(req.body);
      res.status(201).json(newBudget);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // GET route to retrieve all buy records
  router.get('/budget', async (req, res) => {
    try {
      const budget = await Budget.find()
        .populate('vendor')
        .populate('products.product');
  
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // GET route to retrieve information about a specific buy
  router.get('/budget/:id', async (req, res) => {
    try {
      const budget = await Budget.findById(req.params.id)
        .populate('vendor')
        .populate('products.product');
  
      if (!budget) {
        return res.status(404).json({ message: 'Buy not found' });
      }
  
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;

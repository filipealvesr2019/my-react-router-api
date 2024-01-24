// routes/unitOfMeasure.js
const express = require('express');
const router = express.Router();
const UnitOfMeasure = require('../../models/productStock/UnitOfMeasure');

// Rota para obter todas as unidades de medida
router.get('/unitOfMeasurements', async (req, res) => {
  try {
    const units = await UnitOfMeasure.find({}, { _id: 0, __v: 0 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para cadastrar uma nova unidade de medida
router.post('/unitOfMeasurements', async (req, res) => {
  try {
    const {
      name,
      unit,
      converter,
      conversionOperator,
      taxableUnitOfMeasure,
    } = req.body;

    const newUnit = await UnitOfMeasure.create({
      name,
      unit,
      converter,
      conversionOperator,
      taxableUnitOfMeasure,
    });

    res.json(newUnit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Outras rotas relacionadas a UnitOfMeasure

module.exports = router;

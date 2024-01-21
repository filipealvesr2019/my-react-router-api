// routes/account.js

const express = require('express');
const router = express.Router();
const Account = require('../../models/transactions/account'); // Supondo que você tenha um modelo Account

// Rota para obter todas as contas
router.get('/account', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar uma nova conta
router.post('/account', async (req, res) => {
  const account = new Account({
    name: req.body.name, // Substitua com os campos necessários para a conta
    // Adicione outros campos conforme necessário
  });

  try {
    const newAccount = await account.save();
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

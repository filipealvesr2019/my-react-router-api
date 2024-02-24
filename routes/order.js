const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const Customer = require("../models/Customer");
const Cart = require("../models/cart");
const axios = require("axios")

// Rota para enviar um pagamento para o endpoint do Asaas
// Rota para enviar um pagamento para o endpoint do Asaas
// Rota para enviar um pagamento para o endpoint do Asaas
// Rota para enviar um pagamento para o endpoint do Asaas
router.post('/send-payment/', async (req, res) => {
    const token = process.env.ACCESS_TOKEN;

    const url = 'https://sandbox.asaas.com/api/v3/payments';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        access_token: token
      },
      body: JSON.stringify({
        billingType: 'BOLETO',
        discount: {value: 10, dueDateLimitDays: 0},
        interest: {value: 2},
        fine: {value: 1},
        customer: 'cus_000005892172',
        dueDate: '2024-02-24',
        value: 100,
        description: 'Pedido 056984',
        daysAfterDueDateToCancellationRegistration: 1,
        externalReference: '056984',
        postalService: false
      })
    };
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
});





module.exports = router;

// authRoutes.js
const express = require('express');
const router = express.Router();

const Cart = require("../models/cart")
const Customer = require('../models/Customer'); // Importe o modelo do Customer
const Product = require('../models/product');
const axios = require("axios");
const Frete = require('../models/Frete');
// Rota para criar um novo usuário

router.post('/signup', async (req, res) => {
  try {
    const {
      clerkUserId,
      name,
      cpfCnpj,
      mobilePhone,
      email,
      postalCode,
      address,
      addressNumber,
      complement,
      province,
      city,
      state,
      asaasCustomerId,
      cart
    } = req.body;

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado. Faça login ou utilize outro email.' });
    }

    const newUser = new Customer({
      clerkUserId,
      name,
      cpfCnpj,
      mobilePhone,
      email,
      postalCode,
      address,
      addressNumber,
      complement,
      province,
      city,
      state,
      asaasCustomerId,
      cart
    });

    const savedUser = await newUser.save();

    const token = process.env.ACCESS_TOKEN;
    const url = 'https://sandbox.asaas.com/api/v3/customers';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        access_token: token
      },
      body: JSON.stringify({
        name,
        cpfCnpj,
        mobilePhone,
        email,
        postalCode,
        address,
        addressNumber,
        complement,
        province,
        city,
        state
      })
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    // Salva o ID do cliente retornado pelo Asaas no novo campo
    savedUser.asaasCustomerId = responseData.id;
    await savedUser.save();

    res.status(201).json({ user: savedUser, message: 'Usuário criado com sucesso.', responseData });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
  }
});
















router.put('/update/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    const {
      name,
      cpfCnpj,
      mobilePhone,
      email,
      postalCode,
      address,
      addressNumber,
      complement,
      province,
      city,
      state,
      asaasCustomerId,
      cart
    } = req.body;

    // Encontra o usuário com base no clerkUserId
    const existingUser = await Customer.findOne({ clerkUserId });

    // Verifica se o usuário existe
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza os campos do usuário
    if (name) existingUser.name = name;
    if (cpfCnpj) existingUser.cpfCnpj = cpfCnpj;
    if (mobilePhone) existingUser.mobilePhone = mobilePhone;
    if (email) existingUser.email = email;
    if (postalCode) existingUser.postalCode = postalCode;
    if (address) existingUser.address = address;
    if (addressNumber) existingUser.addressNumber = addressNumber;
    if (complement) existingUser.complement = complement;
    if (province) existingUser.province = province;
    if (city) existingUser.city = city;
    if (state) existingUser.state = state;
    if (asaasCustomerId) existingUser.asaasCustomerId = asaasCustomerId;
    if (cart) existingUser.cart = cart;

    // Salva as alterações no banco de dados
    const savedUser = await existingUser.save();

    res.status(200).json({ user: savedUser, message: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
  }
});



































router.get('/customersByAsaas', async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const url = 'https://sandbox.asaas.com/api/v3/customers';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        access_token: token
      }
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erro ao pegar clientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao pegar clientes.' });
  }
});



router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ customers });
  } catch (error) {
    console.error('Erro ao pegar clientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao pegar clientes.' });
  }
});


router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao pegar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao pegar usuário.' });
  }
});



router.get('/favorites/:clerkUserId', async (req, res) => {
  try {
    // Extrair ID do usuário do parâmetro da rota
    const { clerkUserId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ clerkUserId });
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Obter os detalhes dos produtos favoritos do usuário
    const favoriteProducts = await Product.find({ _id: { $in: existingUser.favorites } });

    res.status(200).json({ favorites: favoriteProducts });
  } catch (error) {
    console.error('Erro ao visualizar produtos favoritos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao visualizar produtos favoritos.' });
  }
});

router.post('/favorites', async (req, res) => {
  try {
    // Extrair ID do usuário do corpo da solicitação
    const { clerkUserId } = req.body;

    // Extrair ID do produto do corpo da solicitação
    const { productId } = req.body;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ clerkUserId });
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Encontrar o produto pelo ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Verificar se o produto já está nos favoritos do usuário
    const isProductInFavorites = existingUser.favorites.map(favorite => favorite.toString()).includes(productId);
    if (isProductInFavorites) {
      // Remover o produto dos favoritos do usuário
      existingUser.favorites = existingUser.favorites.filter((favProduct) => favProduct.toString() !== productId);
    } else {
      // Adicionar o produto aos favoritos do usuário
      existingUser.favorites.push(product._id);
    }

    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await existingUser.save();

    res.status(200).json({ user: updatedUser, message: 'Produto adicionado/removido dos favoritos com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar/remover produto dos favoritos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao adicionar/remover produto dos favoritos.' });
  }
});


router.delete('/favorites/:clerkUserId/:productId', async (req, res) => {
  try {
    // Extrair ID do usuário e do produto dos parâmetros da solicitação
    const { clerkUserId, productId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ clerkUserId });
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o produto está nos favoritos do usuário
    const isProductInFavorites = existingUser.favorites.map(favorite => favorite.toString()).includes(productId);
    if (!isProductInFavorites) {
      return res.status(400).json({ message: 'Produto não está nos favoritos do usuário.' });
    }

    // Remover o produto dos favoritos do usuário
    existingUser.favorites = existingUser.favorites.filter((id) => id.toString() !== productId);
    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await existingUser.save();

    res.status(200).json({ user: updatedUser, message: 'Produto removido dos favoritos com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover produto dos favoritos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao remover produto dos favoritos.' });
  }
  
});


// Rota para adicionar um produto ao carrinho de um cliente
router.post('/add-to-cart/:clerkUserId', async (req, res) => {
    try {
        const clerkUserId = req.params.clerkUserId;
        const { productId, quantity } = req.body;

        // Encontra o cliente associado ao atendente
        const customer = await Customer.findOne({ clerkUserId: clerkUserId });

        if (!customer) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        // Encontra o carrinho do cliente
        let cart = await Cart.findOne({ customer: customer._id });

        // Se o carrinho não existir, cria um novo
        if (!cart) {
            cart = new Cart({ customer: customer._id, products: [] });
        }

        // Encontra o produto
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        // Adiciona o produto ao carrinho
        cart.products.push({ productId: productId, quantity: quantity });
        await cart.save();

        // Retorna informações sobre o produto adicionado
        const addedProduct = await Product.findById(productId);
        res.status(200).json({ cart: cart, addedProductId: addedProduct._id, message: 'Produto adicionado ao carrinho com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar produto ao carrinho.' });
    }
});

router.get('/cart/:clerkUserId', async (req, res) => {
  try {
      const clerkUserId = req.params.clerkUserId;

      // Encontra o cliente associado ao atendente
      const customer = await Customer.findOne({ clerkUserId: clerkUserId });

      if (!customer) {
          return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Encontra o carrinho do cliente
      const cart = await Cart.findOne({ customer: customer._id }).populate('products.productId');

      if (!cart) {
          return res.status(404).json({ message: 'Carrinho não encontrado.' });
      }

      // Adiciona o shippingFee ao objeto cart
      cart.shippingFee = cart.shippingFee;

      // Retorna os produtos no carrinho
      res.status(200).json({ cart, message: 'Produtos no carrinho.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao mostrar produtos no carrinho.' });
  }
});





// Rota para atualizar a quantidade de um produto no carrinho de um cliente
router.put('/update-quantity/:clerkUserId/:productId', async (req, res) => {
  try {
      const clerkUserId = req.params.clerkUserId;
      const productId = req.params.productId;
      const { quantity } = req.body;

      // Encontra o cliente associado ao atendente
      const customer = await Customer.findOne({ clerkUserId: clerkUserId });

      if (!customer) {
          return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Encontra o carrinho do cliente
      let cart = await Cart.findOne({ customer: customer._id });

      if (!cart) {
          return res.status(404).json({ message: 'Carrinho não encontrado.' });
      }

      // Encontra o produto no carrinho
      const productIndex = cart.products.findIndex(product => product.productId.toString() === productId);

      if (productIndex === -1) {
          return res.status(404).json({ message: 'Produto não encontrado no carrinho.' });
      }

      // Atualiza a quantidade do produto no carrinho
      cart.products[productIndex].quantity = quantity;
      await cart.save();

      // Retorna informações sobre o produto atualizado
      const updatedProduct = await Product.findById(productId);
      res.status(200).json({ cart: cart, updatedProductId: updatedProduct._id, message: 'Quantidade do produto atualizada no carrinho com sucesso.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar quantidade do produto no carrinho.' });
  }
});


router.get('/cart/:clerkUserId/total-price', async (req, res) => {
  try {
      const clerkUserId = req.params.clerkUserId;

      // Encontra o cliente associado ao atendente
      const customer = await Customer.findOne({ clerkUserId: clerkUserId });

      if (!customer) {
          return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Encontra o carrinho do cliente
      const cart = await Cart.findOne({ customer: customer._id }).populate('products.productId');

      if (!cart) {
          return res.status(404).json({ message: 'Carrinho não encontrado.' });
      }

      // Inclui a taxa de envio do carrinho no objeto cart
      cart.shippingFee = cart.shippingFee;

      // Calcula o total do preço dos produtos no carrinho
      const totalPrice = cart.products.reduce((total, product) => total + (product.productId.price * product.quantity), 0);
      const totalAmount = totalPrice + cart.shippingFee;

      // Retorna o total do preço dos produtos no carrinho
      res.status(200).json({ totalAmount, message: 'Total do preço dos produtos no carrinho.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao calcular o total do preço dos produtos no carrinho.' });
  }
});














router.get('/fretes', async (req, res) => {
  try {
    const fretes = await Frete.find();
    res.json(fretes);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/frete/:clerkUserId', async (req, res) => {
  try {
    const token = process.env.KUNGU_TOKEN;
    const cep = req.body.cep;
    const clerkUserId = req.params.clerkUserId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ clerkUserId: clerkUserId });

    if (!customer) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado.' });
    }
    // Apaga os registros de frete anteriores
    await Frete.deleteMany({clerkUserId:clerkUserId})
    const data = {
      cepOrigem: '60762-792',
      cepDestino: cep,
      vlrMerc: 70,
      pesoMerc: 0.33,
      volumes: [
        {
          peso: 0,
          altura: 0,
          largura: 0,
          comprimento: 0,
          tipo: 'string',
          valor: 0,
          quantidade: 0
        }
      ],
      produtos: [
        {
          peso: 0,
          altura: 2,
          largura: 12,
          comprimento: 17,
          valor: 0,
          quantidade: 0
        }
      ],
      servicos: [
        'string'
      ],
      ordernar: 'string'
    };

    const response = await axios.post('https://portal.kangu.com.br/tms/transporte/simular', data, {
      headers: {
        'token': token,
        'Origin': 'https://serveradmin-whhj.onrender.com/'
      }
    });

    // Verifica se a resposta é um array
    if (Array.isArray(response.data)) {
      // Se for um array, faz um loop sobre os itens e salva cada um
      for (const item of response.data) {
        const frete = new Frete({
          clerkUserId: clerkUserId, // Agora é uma string
          nomeTransportadora: item.transp_nome,
          dataPrevistaEntrega: item.dtPrevEnt,
          prazoEntrega: item.prazoEnt,
          valorFrete: item.vlrFrete
        });

        await frete.save();
      }
    } else {
      // Se não for um array, salva apenas um item
      const frete = new Frete({
        clerkUserId: clerkUserId, // Agora é uma string
        nomeTransportadora: response.data.transp_nome,
        dataPrevistaEntrega: response.data.dtPrevEnt,
        prazoEntrega: response.data.prazoEnt,
        valorFrete: response.data.vlrFrete
      });

      await frete.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});










router.get('/frete/:clerkUserId', async (req, res) => {
  try {
    const clerkUserId = req.params.clerkUserId;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ clerkUserId: clerkUserId });

    if (!customer) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    // Encontra os fretes associados ao cliente
    const fretes = await Frete.find({ clerkUserId: clerkUserId });

    if (!fretes) {
      return res.status(404).json({ message: 'Fretes não encontrados.' });
    }

    res.json(fretes);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});









router.put('/cart/:clerkUserId/shippingFee/:freteId', async (req, res) => {
  try {
    const clerkUserId = req.params.clerkUserId;
    const freteId = req.params.freteId;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ clerkUserId: clerkUserId });

    if (!customer) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id });

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado.' });
    }

    // Encontra o Frete associado ao cliente
    const frete = await Frete.findById(freteId);

    if (!frete) {
      return res.status(404).json({ message: 'Frete não encontrado.' });
    }

    // Atualiza a taxa de envio do carrinho com o valor do Frete
    cart.shippingFee = frete.valorFrete;
    await cart.save();

    res.status(200).json({ message: 'Taxa de envio do carrinho atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar taxa de envio do carrinho:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar taxa de envio do carrinho.' });
  }
});

module.exports = router;

// authRoutes.js
const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");
const Customer = require("../models/Customer"); // Importe o modelo do Customer
const Product = require("../models/product");
const axios = require("axios");
const Frete = require("../models/Frete");
const Pix = require("../models/Pix");
const Boleto = require("../models/Boleto");
const CreditCard = require("../models/CreditCard");
const creditCardData = require("../models/creditCardData");
const { isAuthenticated } = require("../middleware/middlewares.authMiddleware");
const PixQRcode = require("../models/PixQRcode");

// Rota para criar um novo usuário

router.post("/signup", async (req, res) => {
  try {
    const {
      custumerId,
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
      cart,
    } = req.body;

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email já cadastrado. Faça login ou utilize outro email.",
      });
    }

    const newUser = new Customer({
      custumerId,
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
      cart,
    });

    const savedUser = await newUser.save();

    const token = process.env.ACCESS_TOKEN;
    const url = "https://sandbox.asaas.com/api/v3/customers";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        access_token: token,
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
        state,
      }),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    // Salva o ID do cliente retornado pelo Asaas no novo campo
    savedUser.asaasCustomerId = responseData.id;
    await savedUser.save();

    res.status(201).json({
      user: savedUser,
      message: "Usuário criado com sucesso.",
      responseData,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao criar usuário." });
  }
});

router.put("/update/:custumerId", async (req, res) => {
  try {
    const { custumerId } = req.params;
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
      cart,
    } = req.body;

    // Encontra o usuário com base no clerkUserId
    const existingUser = await Customer.findOne({ custumerId });

    // Verifica se o usuário existe
    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
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
    if (cart) existingUser.cart = cart;

    // Salva as alterações no banco de dados
    const savedUser = await existingUser.save();

    // Encontra o asaasCustomerId associado ao clerkUserId
    const asaasCustomerId = existingUser.asaasCustomerId;
    const token = process.env.ACCESS_TOKEN;

    // Atualiza o cliente no Asaas
    const asaasOptions = {
      method: "PUT",
      url: `https://sandbox.asaas.com/api/v3/customers/${asaasCustomerId}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        access_token: token,
      },
      data: {
        name,
        email,
        phone: mobilePhone,
        cpfCnpj,
        postalCode,
        address,
        addressNumber,
        complement,
        province,
        externalReference: custumerId,
        notificationDisabled: false,
        additionalEmails: email,
      },
    };

    await axios.request(asaasOptions);

    res.status(200).json({
      user: savedUser,
      message: "Usuário e cliente no Asaas atualizados com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao atualizar usuário." });
  }
});

router.get("/customersByAsaas", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const url = "https://sandbox.asaas.com/api/v3/customers";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        access_token: token,
      },
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Erro ao pegar clientes:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao pegar clientes." });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Erro ao pegar clientes:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao pegar clientes." });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erro ao pegar usuário:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao pegar usuário." });
  }
});

router.get("/custumer/:custumerId", async (req, res) => {
  try {
    const { custumerId } = req.params;

    // Encontra o usuário com base no clerkUserId
    const existingUser = await Customer.findOne({ custumerId });

    // Verifica se o usuário existe
    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Retorna as informações do usuário
    res.status(200).json(existingUser);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar usuário." });
  }
});

router.get("/favorites/:custumerId", async (req, res) => {
  try {
    // Extrair ID do usuário do parâmetro da rota
    const { custumerId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ custumerId });
    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Obter os detalhes dos produtos favoritos do usuário
    const favoriteProducts = await Product.find({
      _id: { $in: existingUser.favorites },
    });

    res.status(200).json({ favorites: favoriteProducts });
  } catch (error) {
    console.error("Erro ao visualizar produtos favoritos:", error);
    res.status(500).json({
      message: "Erro interno do servidor ao visualizar produtos favoritos.",
    });
  }
});

router.post("/favorites", async (req, res) => {
  try {
    // Extrair ID do usuário do corpo da solicitação
    const { custumerId } = req.body;

    // Extrair ID do produto do corpo da solicitação
    const { productId } = req.body;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ custumerId });
    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Encontrar o produto pelo ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    // Verificar se o produto já está nos favoritos do usuário
    const isProductInFavorites = existingUser.favorites
      .map((favorite) => favorite.toString())
      .includes(productId);
    if (isProductInFavorites) {
      // Remover o produto dos favoritos do usuário
      existingUser.favorites = existingUser.favorites.filter(
        (favProduct) => favProduct.toString() !== productId
      );
    } else {
      // Adicionar o produto aos favoritos do usuário
      existingUser.favorites.push(product._id);
    }

    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await existingUser.save();

    res.status(200).json({
      user: updatedUser,
      message: "Produto adicionado/removido dos favoritos com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao adicionar/remover produto dos favoritos:", error);
    res.status(500).json({
      message:
        "Erro interno do servidor ao adicionar/remover produto dos favoritos.",
    });
  }
});

router.delete("/favorites/:custumerId/:productId", async (req, res) => {
  try {
    // Extrair ID do usuário e do produto dos parâmetros da solicitação
    const { custumerId, productId } = req.params;

    // Verificar se o usuário existe pelo ID
    const existingUser = await Customer.findOne({ custumerId });
    if (!existingUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Verificar se o produto está nos favoritos do usuário
    const isProductInFavorites = existingUser.favorites
      .map((favorite) => favorite.toString())
      .includes(productId);
    if (!isProductInFavorites) {
      return res
        .status(400)
        .json({ message: "Produto não está nos favoritos do usuário." });
    }

    // Remover o produto dos favoritos do usuário
    existingUser.favorites = existingUser.favorites.filter(
      (id) => id.toString() !== productId
    );
    // Salvar o usuário atualizado no banco de dados
    const updatedUser = await existingUser.save();

    res.status(200).json({
      user: updatedUser,
      message: "Produto removido dos favoritos com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao remover produto dos favoritos:", error);
    res.status(500).json({
      message: "Erro interno do servidor ao remover produto dos favoritos.",
    });
  }
});

// Rota para adicionar um produto ao carrinho de um cliente
router.post("/add-to-cart/:custumerId", async (req, res) => {
  try {
    const custumerId = req.params.custumerId;

    const { productId, quantity, size, color } = req.body;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
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
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    // Adiciona o produto ao carrinho
    cart.products.push({
      productId: productId,
      quantity: quantity,
      size: size,
      color: color,
    });
    await cart.save();

    // Retorna informações sobre o produto adicionado
    const addedProduct = await Product.findById(productId);
    res.status(200).json({
      cart: cart,
      addedProductId: addedProduct._id,
      message: "Produto adicionado ao carrinho com sucesso.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar produto ao carrinho." });
  }
});

router.get("/cart/:custumerId",  async (req, res) => {
  try {
    const custumerId = req.params.custumerId;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Adiciona o shippingFee ao objeto cart
    cart.shippingFee = cart.shippingFee;

    // Retorna os produtos no carrinho
    res.status(200).json({ cart, message: "Produtos no carrinho." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao mostrar produtos no carrinho." });
  }
});

// Rota para atualizar a quantidade de um produto no carrinho de um cliente
router.put("/update-quantity/:clerkUserId/:productId", async (req, res) => {
  try {
    const clerkUserId = req.params.clerkUserId;
    const productId = req.params.productId;
    const { quantity } = req.body;
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "A quantidade deve ser um número positivo." });
    }

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ clerkUserId: clerkUserId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    let cart = await Cart.findOne({ customer: customer._id });

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Encontra o produto no carrinho
    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Produto não encontrado no carrinho." });
    }

    // Atualiza a quantidade do produto no carrinho
    cart.products[productIndex].quantity = quantity;
    await cart.save();

    // Retorna informações sobre o produto atualizado
    const updatedProduct = await Product.findById(productId);
    res.status(200).json({
      cart: cart,
      updatedProductId: updatedProduct._id,
      message: "Quantidade do produto atualizada no carrinho com sucesso.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao atualizar quantidade do produto no carrinho.",
    });
  }
});

router.get("/cart/:clerkUserId/total-price", async (req, res) => {
  try {
    const clerkUserId = req.params.clerkUserId;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ clerkUserId: clerkUserId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Inclui a taxa de envio do carrinho no objeto cart
    cart.shippingFee = cart.shippingFee;

    // Calcula o total do preço dos produtos no carrinho
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.productId.price * product.quantity,
      0
    );
    const totalAmount = totalPrice + cart.shippingFee;

    // Retorna o total do preço dos produtos no carrinho
    res.status(200).json({
      totalAmount,
      message: "Total do preço dos produtos no carrinho.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao calcular o total do preço dos produtos no carrinho.",
    });
  }
});

// Rota para excluir um produto do carrinho de um cliente
router.delete("/remove-from-cart/:custumerId/:productId", async (req, res) => {
  try {
    const custumerId = req.params.custumerId;
    const productId = req.params.productId;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    let cart = await Cart.findOne({ customer: customer._id });

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Encontra o produto no carrinho
    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Produto não encontrado no carrinho." });
    }

    // Remove o produto do carrinho
    cart.products.splice(productIndex, 1);
    await cart.save();

    // Retorna informações sobre o produto removido
    const removedProduct = await Product.findById(productId);
    res.status(200).json({
      cart: cart,
      removedProductId: removedProduct._id,
      message: "Produto removido do carrinho com sucesso.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao remover produto do carrinho." });
  }
});


router.get("/fretes", async (req, res) => {
  try {
    const fretes = await Frete.find();
    res.json(fretes);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/frete/:custumerId", async (req, res) => {
  try {
    const token = process.env.KUNGU_TOKEN;
    const cep = req.body.cep;
    const custumerId = req.params.custumerId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }
    // Apaga os registros de frete anteriores
    await Frete.deleteMany({ custumerId: custumerId });
    const data = {
      cepOrigem: "60762-792",
      cepDestino: cep,
      vlrMerc: 70,
      pesoMerc: 0.33,
      volumes: [
        {
          peso: 0,
          altura: 0,
          largura: 0,
          comprimento: 0,
          tipo: "string",
          valor: 0,
          quantidade: 0,
        },
      ],
      produtos: [
        {
          peso: 0,
          altura: 2,
          largura: 12,
          comprimento: 17,
          valor: 0,
          quantidade: 0,
        },
      ],
      servicos: ["string"],
      ordernar: "string",
    };

    const response = await axios.post(
      "https://portal.kangu.com.br/tms/transporte/simular",
      data,
      {
        headers: {
          token: token,
          Origin: "https://serveradmin-whhj.onrender.com/",
        },
      }
    );

    // Verifica se a resposta é um array
    if (Array.isArray(response.data)) {
      // Se for um array, faz um loop sobre os itens e salva cada um
      for (const item of response.data) {
        const frete = new Frete({
          clerkUserId: clerkUserId, // Agora é uma string
          nomeTransportadora: item.transp_nome,
          dataPrevistaEntrega: item.dtPrevEnt,
          prazoEntrega: item.prazoEnt,
          valorFrete: item.vlrFrete,
          logo: item.url_logo,
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
        valorFrete: response.data.vlrFrete,
        logo: item.url_logo,
      });

      await frete.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/cart/:custumerId/shippingFee/:freteId", async (req, res) => {
  try {
    const custumerId = req.params.custumerId;
    const freteId = req.params.freteId;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id });

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Encontra o Frete associado ao cliente
    const frete = await Frete.findById(freteId);

    if (!frete) {
      return res.status(404).json({ message: "Frete não encontrado." });
    }

    // Atualiza a taxa de envio do carrinho com o valor do Frete
    cart.shippingFee = frete.valorFrete;
    await cart.save();

    res
      .status(200)
      .json({ message: "Taxa de envio do carrinho atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar taxa de envio do carrinho:", error);
    res.status(500).json({
      message:
        "Erro interno do servidor ao atualizar taxa de envio do carrinho.",
    });
  }
});

router.get("/frete/:custumerId", async (req, res) => {
  try {
    const custumerId = req.params.custumerId;

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra os fretes associados ao cliente
    const fretes = await Frete.find({ custumerId: custumerId });

    if (!fretes) {
      return res.status(404).json({ message: "Fretes não encontrados." });
    }

    // Remove fretes duplicados
    const fretesUnicos = fretes.reduce((unique, current) => {
      const exists = unique.some(
        (item) => item.nomeTransportadora === current.nomeTransportadora
      );
      if (!exists) {
        unique.push(current);
      }
      return unique;
    }, []);

    res.json(fretesUnicos);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// pagar com pix sem checkout transparente
router.post("/pix/:custumerId", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const custumerId = req.params.custumerId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Remove todos os produtos do carrinho
    const result = await Cart.deleteMany({ customer: customer._id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado no carrinho." });
    }

    // Encontra o asaasCustomerId do cliente
    const asaasCustomerId = customer.asaasCustomerId;
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.productId.price * product.quantity,
      0
    );
    const totalAmount = totalPrice + cart.shippingFee;

    // Cria uma string vazia para armazenar os IDs dos produtos
    let externalReferences = "";

    // Itera sobre os produtos no carrinho
    for (const product of cart.products) {
      // Adiciona o ID do produto à string externalReferences
      externalReferences += product.productId._id + ", ";
    }

    // Remove a vírgula extra no final da string externalReferences
    externalReferences = externalReferences.slice(0, -1);

    // Apaga os registros de frete anteriores
    const data = {
      billingType: "PIX",
      discount: { value: 0, dueDateLimitDays: 0 },
      interest: { value: 0 },
      fine: { value: 0 },
      customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
      dueDate: new Date(), // Define a data atual como a data de vencimento
      value: totalAmount,
      description: "Pedido 056984",
      daysAfterDueDateToCancellationRegistration: 1,
      externalReference: externalReferences,
      postalService: false,
    };

    const response = await axios.post(
      "https://sandbox.asaas.com/api/v3/payments",
      data,
      {
        headers: {
          accept: " 'application/json'",
          "content-type": "application/json",
          access_token: token,
        },
      }
    );

    // Verifica se a resposta é um array
    if (Array.isArray(response.data)) {
      // Se for um array, faz um loop sobre os itens e salva cada um
      for (const item of response.data) {
        const pix = new Pix({
          custumerId: custumerId, // Agora é uma string
          customer: item.customer,
          billingType: item.billingType,
          value: item.value,
          externalReference: item.externalReference,
          invoiceUrl: item.invoiceUrl,
          bankSlipUrl: item.bankSlipUrl,
          dueDate: item.dueDate,
        });

        await pix.save();
      }
    } else {
      // Se não for um array, salva apenas um item
      const pix = new Pix({
        custumerId: custumerId, // Agora é uma string
        customer: response.data.customer,
        billingType: response.data.billingType,
        value: response.data.value,
        externalReference: response.data.externalReference,
        invoiceUrl: response.data.invoiceUrl,
        bankSlipUrl: response.data.bankSlipUrl,
        dueDate: response.data.dueDate,
      });

      await pix.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// pagar boleto sem checkout transparente
router.post("/boleto/:custumerId", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const custumerId = req.params.custumerId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Remove todos os produtos do carrinho
    const result = await Cart.deleteMany({ customer: customer._id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado no carrinho." });
    }
    // Encontra o asaasCustomerId do cliente
    const asaasCustomerId = customer.asaasCustomerId;
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.productId.price * product.quantity,
      0
    );
    const totalAmount = totalPrice + cart.shippingFee;

    // Cria uma string vazia para armazenar os IDs dos produtos
    let externalReferences = "";

    // Itera sobre os produtos no carrinho
    for (const product of cart.products) {
      // Adiciona o ID do produto à string externalReferences
      externalReferences += product.productId._id + ",";
    }

    // Remove a vírgula extra no final da string externalReferences
    externalReferences = externalReferences.slice(0, -1);

    // Apaga os registros de frete anteriores
    const data = {
      billingType: "BOLETO",
      discount: { value: 0, dueDateLimitDays: 0 },
      interest: { value: 0 },
      fine: { value: 0 },
      customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
      dueDate: new Date(), // Define a data atual como a data de vencimento
      value: totalAmount,
      description: "Pedido 056984",
      daysAfterDueDateToCancellationRegistration: 1,
      externalReference: externalReferences,
      postalService: false,
    };

    const response = await axios.post(
      "https://sandbox.asaas.com/api/v3/payments",
      data,
      {
        headers: {
          accept: " 'application/json'",
          "content-type": "application/json",
          access_token: token,
        },
      }
    );

    // Verifica se a resposta é um array
    if (Array.isArray(response.data)) {
      // Se for um array, faz um loop sobre os itens e salva cada um
      for (const item of response.data) {
        const boleto = new Boleto({
          clerkUserId: clerkUserId, // Agora é uma string
          customer: item.customer,
          billingType: item.billingType,
          value: item.value,
          externalReference: item.externalReference,
          invoiceUrl: item.invoiceUrl,
          bankSlipUrl: item.bankSlipUrl,
          dueDate: item.dueDate,
        });

        await boleto.save();
      }
    } else {
      // Se não for um array, salva apenas um item
      const boleto = new Boleto({
        clerkUserId: clerkUserId, // Agora é uma string
        customer: response.data.customer,
        billingType: response.data.billingType,
        value: response.data.value,
        externalReference: response.data.externalReference,
        invoiceUrl: response.data.invoiceUrl,
        bankSlipUrl: response.data.bankSlipUrl,
        dueDate: response.data.dueDate,
      });

      await boleto.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// pagar creditCard com checkout transparente
router.post("/creditCard/:custumerId", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const custumerId = req.params.custumerId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Remove todos os produtos do carrinho
    const result = await Cart.deleteMany({ customer: customer._id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado no carrinho." });
    }
    // Encontra o asaasCustomerId do cliente
    const asaasCustomerId = customer.asaasCustomerId;
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.productId.price * product.quantity,
      0
    );
    const totalAmount = totalPrice + cart.shippingFee;

    // Cria uma string vazia para armazenar os IDs dos produtos
    let externalReferences = "";

    // Itera sobre os produtos no carrinho
    for (const product of cart.products) {
      // Adiciona o ID do produto à string externalReferences
      externalReferences += product.productId._id + ",";
    }

    // Remove a vírgula extra no final da string externalReferences
    externalReferences = externalReferences.slice(0, -1);

    // Apaga os registros de frete anteriores
    const data = {
      billingType: "CREDIT_CARD",
      discount: { value: 0, dueDateLimitDays: 0 },
      interest: { value: 0 },
      fine: { value: 0 },
      customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
      dueDate: new Date(), // Define a data atual como a data de vencimento
      value: totalAmount,
      description: "Pedido 056984",
      daysAfterDueDateToCancellationRegistration: 1,
      externalReference: externalReferences,
      postalService: false,
    };

    const response = await axios.post(
      "https://sandbox.asaas.com/api/v3/payments",
      data,
      {
        headers: {
          accept: " 'application/json'",
          "content-type": "application/json",
          access_token: token,
        },
      }
    );

    // Verifica se a resposta é um array
    if (Array.isArray(response.data)) {
      // Se for um array, faz um loop sobre os itens e salva cada um
      for (const item of response.data) {
        const creditCard = new CreditCard({
          custumerId: custumerId, // Agora é uma string
          customer: item.customer,
          billingType: item.billingType,
          value: item.value,
          externalReference: item.externalReference,
          invoiceUrl: item.invoiceUrl,
          bankSlipUrl: item.bankSlipUrl,
          dueDate: item.dueDate,
        });

        await creditCard.save();
      }
    } else {
      // Se não for um array, salva apenas um item
      const creditCard = new CreditCard({
        custumerId: custumerId, // Agora é uma string
        customer: response.data.customer,
        billingType: response.data.billingType,
        value: response.data.value,
        externalReference: response.data.externalReference,
        invoiceUrl: response.data.invoiceUrl,
        bankSlipUrl: response.data.bankSlipUrl,
        dueDate: response.data.dueDate,
      });

      await creditCard.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// pagar creditCard com checkout transparente
router.post("/creditCardWithoutTokenization/:custumerId", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const custumerId = req.params.custumerId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Remove todos os produtos do carrinho
    const result = await Cart.deleteMany({ customer: customer._id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado no carrinho." });
    }
    // Encontra o asaasCustomerId do cliente
    const asaasCustomerId = customer.asaasCustomerId;
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.productId.price * product.quantity,
      0
    );
    const totalAmount = totalPrice + cart.shippingFee;

    // Cria uma string vazia para armazenar os IDs dos produtos
    let externalReferences = "";

    // Itera sobre os produtos no carrinho
    for (const product of cart.products) {
      // Adiciona o ID do produto à string externalReferences
      externalReferences += product.productId._id + ",";
    }

    // Remove a vírgula extra no final da string externalReferences
    externalReferences = externalReferences.slice(0, -1);

    // Apaga os registros de frete anteriores
    const data = {
      billingType: "CREDIT_CARD",
      discount: { value: 0, dueDateLimitDays: 0 },
      interest: { value: 0 },
      fine: { value: 0 },
      customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
      dueDate: new Date(), // Define a data atual como a data de vencimento
      value: totalAmount,
      description: "Pedido 056984",
      daysAfterDueDateToCancellationRegistration: 1,
      externalReference: externalReferences,
      postalService: false,
      creditCard: {
        holderName: customer.name,
        number: req.body.number,
        expiryMonth: req.body.expiryMonth,
        expiryYear: req.body.expiryYear,
        ccv: req.body.ccv,
      },
      creditCardHolderInfo: {
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        postalCode:  customer.postalCode,
        addressNumber: customer.addressNumber,
        addressComplement: null,
        phone: customer.mobilePhone
      },
    };

    const response = await axios.post(
      "https://sandbox.asaas.com/api/v3/payments",
      data,
      {
        headers: {
          accept: " 'application/json'",
          "content-type": "application/json",
          access_token: token,
        },
      }
    );

    // Verifica se a resposta é um array
    if (Array.isArray(response.data)) {
      // Se for um array, faz um loop sobre os itens e salva cada um
      for (const item of response.data) {
        const creditCard = new CreditCard({
          custumerId: custumerId, // Agora é uma string
          customer: item.customer,
          billingType: item.billingType,
          value: item.value,
          externalReference: item.externalReference,
          invoiceUrl: item.invoiceUrl,
          bankSlipUrl: item.bankSlipUrl,
          dueDate: item.dueDate,
        });

        await creditCard.save();
      }
    } else {
      // Se não for um array, salva apenas um item
      const creditCard = new CreditCard({
        custumerId: custumerId, // Agora é uma string
        customer: response.data.customer,
        billingType: response.data.billingType,
        value: response.data.value,
        externalReference: response.data.externalReference,
        invoiceUrl: response.data.invoiceUrl,
        bankSlipUrl: response.data.bankSlipUrl,
        dueDate: response.data.dueDate,
      });

      await creditCard.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// pagar boleto com checkout transparente
router.post("/tokenizeCreditCard", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const url = "https://sandbox.asaas.com/api/v3/creditCard/tokenize";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        access_token: token,
      },
      body: JSON.stringify({
        creditCard: {
          holderName: "john doe",
          number: "5162306219378829",
          expiryMonth: "05",
          expiryYear: "2028",
          ccv: "318",
        },
        creditCardHolderInfo: {
          name: "John Doe",
          email: "john.doe@asaas.com.br",
          cpfCnpj: "24971563792",
          postalCode: "89223-005",
          addressNumber: "277",
          addressComplement: null,
          phone: "4738010919",
          mobilePhone: "47998781877",
        },
        customer: "cus_000005899977",
        remoteIp: "116.213.42.532",
      }),
    };

    const response = await fetch(url, options);
    const json = await response.json();

    res.json(json);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/creditCardAndToken/:custumerId", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const url = "https://sandbox.asaas.com/api/v3/creditCard/tokenize";

    const custumerId = req.params.custumerId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Remove todos os produtos do carrinho
    const result = await Cart.deleteMany({ customer: customer._id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado no carrinho." });
    }
    // Encontra o asaasCustomerId do cliente
    const asaasCustomerId = customer.asaasCustomerId;
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.productId.price * product.quantity,
      0
    );
    const totalAmount = totalPrice + cart.shippingFee;

    // Cria uma string vazia para armazenar os IDs dos produtos
    let externalReferences = "";

    // Itera sobre os produtos no carrinho
    for (const product of cart.products) {
      // Adiciona o ID do produto à string externalReferences
      externalReferences += product.productId._id + ",";
    }

    // Remove a vírgula extra no final da string externalReferences
    externalReferences = externalReferences.slice(0, -1);

    const {
      holderName,
      number,
      expiryMonth,
      expiryYear,
      ccv,
      name,
      email,
      cpfCnpj,
      postalCode,
      addressNumber,
      addressComplement,
      phone,
      mobilePhone,
    } = req.body;

    // Crie um novo objeto CreditCardData com os dados do cartão de crédito
    const newCreditCardData = new creditCardData({
      holderName,
      number,
      expiryMonth,
      expiryYear,
      ccv,
    });
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        access_token: token,
      },
      body: JSON.stringify({
        creditCard: {
          holderName,
          number,
          expiryMonth,
          expiryYear,
          ccv,
        },
        creditCardHolderInfo: {
          name,
          email,
          cpfCnpj,
          postalCode,
          addressNumber,
          addressComplement,
          phone,
          mobilePhone,
        },
        customer: asaasCustomerId,
        remoteIp: "116.213.42.532",
      }),
    };

    const tokenResponse = await fetch(url, options);
    const tokenJson = await tokenResponse.json();

    // Verifica se o token foi criado com sucesso
    if (tokenJson.errors) {
      return res.status(400).json({ message: tokenJson.errors[0].description });
    }

    // Aqui está o valor do token criado
    const creditCardToken = tokenJson.creditCardToken;

    // Apaga os registros de frete anteriores

    // Cria a cobrança com o token do cartão de crédito
    const paymentUrl = "https://sandbox.asaas.com/api/v3/payments";
    const paymentOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        access_token: token,
      },
      body: JSON.stringify({
        billingType: "CREDIT_CARD",
        discount: { value: 0, dueDateLimitDays: 0 },
        interest: { value: 0 },
        fine: { value: 0 },
        customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
        dueDate: new Date(), // Define a data atual como a data de vencimento
        value: totalAmount,
        description: "Pedido 056984",
        daysAfterDueDateToCancellationRegistration: 1,
        externalReference: externalReferences,
        postalService: false,
        creditCardToken: creditCardToken, // Adiciona o token do cartão de crédito à cobrança
      }),
    };

    const paymentResponse = await fetch(paymentUrl, paymentOptions);
    const paymentJson = await paymentResponse.json();

    res.json(paymentJson);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// pagar com pix sem checkout transparente
router.post("/pixQRcodeStatico/:custumerId", async (req, res) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    const custumerId = req.params.custumerId; // Agora é uma string

    // Encontra o cliente associado ao atendente
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Encontra o carrinho do cliente
    const cart = await Cart.findOne({ customer: customer._id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    // Remove todos os produtos do carrinho
    const result = await Cart.deleteMany({ customer: customer._id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado no carrinho." });
    }

    // Encontra o asaasCustomerId do cliente
    const asaasCustomerId = customer.asaasCustomerId;
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.productId.price * product.quantity,
      0
    );
    const totalAmount = totalPrice + cart.shippingFee;

    // Cria uma string vazia para armazenar os IDs dos produtos
    let externalReferences = "";

    // Itera sobre os produtos no carrinho
    for (const product of cart.products) {
      // Adiciona o ID do produto à string externalReferences
      externalReferences += product.productId._id + ", ";
    }

    // Remove a vírgula extra no final da string externalReferences
    externalReferences = externalReferences.slice(0, -1);

    // Apaga os registros de frete anteriores
    const data = {
      customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
      value: totalAmount,
      description: "Pedido 056984",
      format: "ALL",
      expirationDate: new Date(), // Define a data atual como a data de vencimento
      allowsMultiplePayments: true,
    };

    const response = await axios.post(
      "https://sandbox.asaas.com/api/v3/pix/qrCodes/static",
      data,
      {
        headers: {
          accept: " 'application/json'",
          "content-type": "application/json",
          access_token: token,
        },
      }
    );

    if (Array.isArray(response.data)) {
      for (const item of response.data) {
        const pix = new PixQRcode({
          customer: data.customer, // Ajuste para usar o cliente correto
          value: data.value, // Ajuste para usar o valor correto
          description: item.description,
          format: item.format,
          expirationDate: new Date(item.expirationDate), // Converte para o formato de data
          allowsMultiplePayments: item.allowsMultiplePayments,
          externalReference: item.externalReference,
          payload: item.payload,
          encodedImage: item.encodedImage,
          id: item.id,
        });

        await pix.save();
      }
    } else {
      const pix = new PixQRcode({
        customer: data.customer, // Ajuste para usar o cliente correto
        value: data.value, // Ajuste para usar o valor correto
        description: response.data.description,
        format: response.data.format,
        expirationDate: new Date(response.data.expirationDate), // Converte para o formato de data
        allowsMultiplePayments: response.data.allowsMultiplePayments,
        externalReference: response.data.externalReference,
        payload: response.data.payload,
        encodedImage: response.data.encodedImage,
        id: response.data.id,
      });

      await pix.save();
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

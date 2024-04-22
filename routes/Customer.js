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
const { isAuthenticated, isAdmin } = require("../middleware/middlewares.authMiddleware");
const PixQRcode = require("../models/PixQRcode");
const PaymentReports = require("../models/paymentReports");
const CustomerController = require("../controllers/CustomerController");

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

router.put(
  "/update/:custumerId",
  isAuthenticated,

  async (req, res) => {
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
  }
);

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

router.get("/customers", isAuthenticated, async (req, res) => {
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

router.get(
  "/custumer/:custumerId",
  isAuthenticated,

  async (req, res) => {
    try {
      // Encontra o usuário com base no clerkUserId
      const existingUser = await Customer.findOne({ custumerId: req.params.custumerId });
     
     
      // Retorna as informações do usuário
      res.status(200).json(existingUser);
     
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res
        .status(500)
        .json({ message: "Erro interno do servidor ao buscar usuário." });
    }
  }
);

router.get(
  "/favorites/:custumerId",
  isAuthenticated,

  async (req, res) => {
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
  }
);

router.post("/favorites", isAuthenticated, async (req, res) => {
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

router.delete(
  "/favorites/:custumerId/:productId",
  isAuthenticated,

  async (req, res) => {
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
  }
);

// Rota para adicionar um produto ao carrinho de um cliente
router.post(
  "/add-to-cart/:custumerId",
  isAuthenticated,

  async (req, res) => {
    try {
      const custumerId = req.params.custumerId;

      const { productId, quantity, size, color, image } = req.body;

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
      // Verifica se o número total de produtos no carrinho já excede quatro
      // if (cart.products.length >= 3) {
      //   return res.status(400).json({
      //     message: "Você só pode adicionar até quatro produtos por vez.",
      //   });
      // }

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
        image: image,
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
      res
        .status(500)
        .json({ message: "Erro ao adicionar produto ao carrinho." });
    }
  }
);

router.get(
  "/cart/:custumerId",
  isAuthenticated,

  async (req, res) => {
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
      res
        .status(500)
        .json({ message: "Erro ao mostrar produtos no carrinho." });
    }
  }
);

// Rota para atualizar a quantidade de um produto no carrinho de um cliente
router.put(
  "/update-quantity/:custumerId/:productId",
  isAuthenticated,

  async (req, res) => {
    try {
      const custumerId = req.params.custumerId;
      const productId = req.params.productId;
      const { quantity } = req.body;
      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "A quantidade deve ser um número positivo." });
      }

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

      // Encontra o produto no banco de dados
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }
      // Verifica se a quantidade no carrinho excede a quantidade disponível do produto
      if (quantity > product.quantity) {
        return res.status(400).json({
          message:
            "A quantidade no carrinho excede a quantidade disponível do produto.",
        });
      }

      // Atualiza a quantidade do produto no carrinho
      cart.products[productIndex].quantity = quantity;
      // Zera o shippingFee do carrinho
      cart.shippingFee = 0;
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
  }
);

// Rota para excluir um produto do carrinho de um cliente
router.delete(
  "/remove-from-cart/:custumerId/:productId",
  isAuthenticated,

  async (req, res) => {
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
  }
);

router.get("/fretes", isAuthenticated, async (req, res) => {
  try {
    const fretes = await Frete.find();
    res.json(fretes);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/frete/:custumerId",

  async (req, res) => {
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
            custumerId: custumerId, // Agora é uma string
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
          custumerId: custumerId, // Agora é uma string
          nomeTransportadora: response.data.transp_nome,
          dataPrevistaEntrega: response.data.dtPrevEnt,
          prazoEntrega: response.data.prazoEnt,
          valorFrete: response.data.vlrFrete,
          logo: response.data.url_logo,
        });

        await frete.save();
      }

      res.json(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/cart/:custumerId/shippingFee/:freteId",
  isAuthenticated,

  async (req, res) => {
    try {
      const custumerId = req.params.custumerId;
      const freteId = req.params.freteId;

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

      // Encontra o Frete associado ao cliente
      const frete = await Frete.findById(freteId);

      if (!frete) {
        return res.status(404).json({ message: "Frete não encontrado." });
      }

      // Calcula o total do preço dos produtos no carrinho
      let totalPrice = cart.products.reduce(
        (total, product) => total + product.productId.price * product.quantity,
        0
      );

      // Atualiza a taxa de envio do carrinho com base na condição
      if (totalPrice >= 300) {
        cart.shippingFee = 0;
      } else {
        cart.shippingFee = frete.valorFrete;
      }

      cart.transportadora.nome = frete.nomeTransportadora;
      cart.logo.img = frete.logo;

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
  }
);

router.get(
  "/cart/:custumerId/total-price",
  isAuthenticated,

  async (req, res) => {
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

      // Calcula o total do preço dos produtos no carrinho
      let totalPrice = cart.products.reduce(
        (total, product) => total + product.productId.price * product.quantity,
        0
      );

      let totalAmount = totalPrice + cart.shippingFee;

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
  }
);

router.get(
  "/frete/:custumerId",
  isAuthenticated,

  async (req, res) => {
    try {
      const custumerId = req.params.custumerId;

      // Encontra o cliente associado ao atendente
      const customer = await Customer.findOne({ custumerId: custumerId });

      if (!customer) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      // Encontra e ordena os fretes associados ao cliente pelo valor do frete
      const fretes = await Frete.find({ custumerId: custumerId }).sort({
        valorFrete: 1,
      });

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
  }
);

// pagar com pix sem checkout transparente
router.post(
  "/pix/:custumerId",
  isAuthenticated,

  async (req, res) => {
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
        description: "",
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
  }
);

// pagar boleto com checkout transparente
router.post(
  "/boleto/:custumerId",
  isAuthenticated,

  async (req, res) => {
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
        customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
        value: totalAmount,
        dueDate: new Date(), // Define a data atual como a data de vencimento
      
       
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
            orderId: item.id,
            billingType: "BOLETO",
            customerId: custumerId, // Agora é uma string
            customer: item.customer,
            billingType: item.billingType,
            value: item.value,
            externalReference: item.externalReference,
            invoiceUrl: item.invoiceUrl,
            bankSlipUrl: item.bankSlipUrl,
            dueDate: item.dueDate,
            shippingFeeData: {
              transportadora: cart.transportadora.nome || "",
              logo: cart.logo.img || "",
              shippingFeePrice: cart.shippingFee,
            },
            products: cart.products.map((product) => ({
              productId: product.productId._id,
              quantity: product.quantity,
              size: product.size,
              color: product.color,
              image: product.image,
              name: product.name,
            })),
            name: customer.name,
         
          });

          await boleto.save();
        }
      } else {
        // Se não for um array, salva apenas um item
        const boleto = new Boleto({
          billingType: "BOLETO",
          customerId: custumerId, // Agora é uma string
          customer: response.data.customer,
          billingType: response.data.billingType,
          value: response.data.value,
          externalReference: response.data.externalReference,
          invoiceUrl: response.data.invoiceUrl,
          bankSlipUrl: response.data.bankSlipUrl,
          dueDate: response.data.dueDate,
          shippingFeeData: {
            transportadora: cart.transportadora.nome || "",
            logo: cart.logo.img || "",
            shippingFeePrice: cart.shippingFee,
          },
          products: cart.products.map((product) => ({
            productId: product.productId._id,
            quantity: product.quantity,
            size: product.size,
            color: product.color,
            image: product.image,
            name: product.name,
          })),
          name: customer.name,
          orderId: response.data.id,
          name: customer.name,
        });

        await boleto.save();
      }

      res.json(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// pagar creditCard com checkout transparente
router.post(
  "/creditCard/:custumerId",
  isAuthenticated,

  async (req, res) => {
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
        description: "",
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
  }
);

// pagar creditCard com checkout transparente
router.post(
  "/creditCardWithoutTokenization/:custumerId",
  isAuthenticated,

  async (req, res) => {
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

      // Pegue o valor do corpo da requisição
      const requestBody = req.body;

      // Extraia o número de parcelas do corpo da requisição
      const installmentCount = parseInt(requestBody.installmentCount);

      // Calcule o valor de cada parcela
      const installmentValue = totalAmount / installmentCount;

      // Define a data de vencimento base
      const dueDate = new Date();

      // Itera sobre o número de parcelas e cria uma cobrança para cada uma
      const payments = [];
      for (let i = 0; i < installmentCount; i++) {
        // Ajusta a data de vencimento para cada parcela, por exemplo, 30 dias após a data atual
        const newDueDate = new Date();
        newDueDate.setDate(dueDate.getDate() + 30 * (i + 1));

        const paymentData = {
          billingType: "CREDIT_CARD",
          discount: { value: 0, dueDateLimitDays: 0 },
          interest: { value: 0 },
          fine: { value: 0 },
          customer: asaasCustomerId,
          dueDate: newDueDate,
          value: installmentValue,
          description: "",
          daysAfterDueDateToCancellationRegistration: 1,
          externalReference: externalReferences,
          postalService: false,
          installmentCount: 1,
          installmentValue: installmentValue,
          installmentNumber: i + 1, // Adiciona o número da parcela
         
        };

        const response = await axios.post(
          "https://sandbox.asaas.com/api/v3/payments",
          paymentData,
          {
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              access_token: token,
            },
          }
        );

        payments.push(response.data);
      }

      // Salva as informações de cobrança no banco de dados
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        const installmentNumber = i + 1; // Número da parcela começa em 1

        const creditCard = new CreditCard({
          orderId: payment.id,
          custumerId: custumerId,
          customer: payment.customer,
          billingType: payment.billingType,
          value: payment.value,
          externalReference: payment.externalReference,
          invoiceUrl: payment.invoiceUrl,
          bankSlipUrl: payment.bankSlipUrl,
          dueDate: payment.dueDate,
          installmentNumber: installmentNumber, // Usando o número de parcela correto
          installmentValue: payment.installmentValue,
          installmentCount: payment.installmentCount,
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
            postalCode: customer.postalCode,
            addressNumber: customer.addressNumber,
            addressComplement: null,
            phone: customer.mobilePhone,
          },
          shippingFeeData: {
            transportadora: cart.transportadora.nome || "",
            logo: cart.logo.img || "",
            shippingFeePrice: cart.shippingFee,
          },
          products: cart.products.map((product) => ({
            productId: product.productId._id,
            quantity: product.quantity,
            size: product.size,
            color: product.color,
            image: product.image,
          })),

          name: customer.name,
        });
        await creditCard.save();
      }

      res.json(payments);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// pagar boleto com checkout transparente
router.post(
  "/tokenizeCreditCard",
  isAuthenticated,

  async (req, res) => {
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
  }
);

router.post(
  "/creditCardAndToken/:custumerId",
  isAuthenticated,

  async (req, res) => {
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
        return res
          .status(400)
          .json({ message: tokenJson.errors[0].description });
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
          description: "",
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
  }
);

// pagar com pix sem checkout transparente
router.post(
  "/pixQRcodeStatico/:custumerId",
  isAuthenticated,

  async (req, res) => {
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

      // Atualiza a quantidade de cada produto no banco de dados
      for (const product of cart.products) {
        await Product.findByIdAndUpdate(
          product.productId._id,
          { $inc: { quantity: -product.quantity } }, // Decrementa a quantidade pelo número de produtos no carrinho
          { new: true }
        );
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
      const addressKey = process.env.ADDRESS_KEY;
      // Apaga os registros de frete anteriores
      const data = {
        addressKey: addressKey,
        customer: asaasCustomerId, // Substitui 'cus_000005895208' pelo asaasCustomerId
        value: totalAmount,
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
            billingType: "PIX",
            custumerId: custumerId,
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
            shippingFeeData: {
              transportadora: cart.transportadora.nome || "",
              logo: cart.logo.img || "",
              shippingFeePrice: cart.shippingFee,
            },
            products: cart.products.map((product) => ({
              productId: product.productId._id,
              quantity: product.quantity,
              size: product.size,
              color: product.color,
              image: product.image,
            })),
            name: customer.name,

          });

          await pix.save();
        }
      } else {
        const pix = new PixQRcode({
          billingType: "PIX",
          custumerId: custumerId,
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
          shippingFeeData: {
            transportadora: cart.transportadora.nome || "",
            logo: cart.logo.img || "",
            shippingFeePrice: cart.shippingFee,
          },
          products: cart.products.map((product) => ({
            productId: product.productId._id,
            quantity: product.quantity,
            size: product.size,
            color: product.color,
            image: product.image,
          })),
          name: customer.name,
      
        });

        await pix.save();
      }
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// relatorio com status dos pedidos dos consumidores
router.post("/reports", async (req, res) => {
  try {
    const newPaymentData = req.body;
    const paymentId = newPaymentData.payment.id;

    // Verificar se já existe um pagamento com esse ID
    const existingPayment = await PaymentReports.findOne({
      "payment.id": paymentId,
    });

    if (existingPayment) {
      // Se já existe, atualize as informações existentes
      await PaymentReports.findOneAndUpdate(
        { "payment.id": paymentId },
        newPaymentData
      );
      res.status(200).json({ message: "Informações atualizadas com sucesso" });
    } else {
      // Se não existe, crie um novo documento
      const newPayment = await PaymentReports.create(newPaymentData);
      res.status(200).json(newPayment);
    }
  } catch (error) {
    console.error("Erro ao criar/atualizar pagamento:", error);
    res.status(500).json({ error: "Erro ao criar/atualizar pagamento" });
  }
});

// Rota para adicionar código de rastreamento a um pedido específico do QR code
router.post("/add/traking/boleto/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { trackingCode } = req.body;

    // Verifica se o código de rastreamento é fornecido
    if (!trackingCode) {
      return res
        .status(400)
        .json({ error: "Código de rastreamento é obrigatório." });
    }

    // Procura pelo pedido específico na base de dados
    const order = await Boleto.findById(orderId);

    // Verifica se o pedido existe
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    // Atualiza o código de rastreamento do pedido
    order.trackingCode = trackingCode;

    // Salva as alterações no banco de dados
    await order.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({
      message:
        "Código de rastreamento adicionado com sucesso ao pedido do boleto QR code.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para adicionar código de rastreamento a um pedido específico do QR code
router.post("/add/traking/pix/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { trackingCode } = req.body;

    // Verifica se o código de rastreamento é fornecido
    if (!trackingCode) {
      return res
        .status(400)
        .json({ error: "Código de rastreamento é obrigatório." });
    }

    // Procura pelo pedido específico na base de dados
    const order = await PixQRcode.findById(orderId);

    // Verifica se o pedido existe
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    // Atualiza o código de rastreamento do pedido
    order.trackingCode = trackingCode;

    // Salva as alterações no banco de dados
    await order.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({
      message:
        "Código de rastreamento adicionado com sucesso ao pedido do boleto QR code.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para adicionar código de rastreamento a um pedido específico do QR code
router.post("/add/traking/creditCard/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { trackingCode } = req.body;

    // Verifica se o código de rastreamento é fornecido
    if (!trackingCode) {
      return res
        .status(400)
        .json({ error: "Código de rastreamento é obrigatório." });
    }

    // Procura pelo pedido específico na base de dados
    const order = await CreditCard.findById(orderId);

    // Verifica se o pedido existe
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    // Atualiza o código de rastreamento do pedido
    order.trackingCode = trackingCode;

    // Salva as alterações no banco de dados
    await order.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({
      message:
        "Código de rastreamento adicionado com sucesso ao pedido do boleto QR code.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/orders/:custumerId", async (req, res) => {
  const custumerId = req.params.custumerId;
 
  
  try {
     const page = req.query.page ? parseInt(req.query.page) : 1;
  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid page number" });
  }
    const pageSize = 5; // Tamanho da página
    const skip = (page - 1) * pageSize; // Quantidade de documentos a pular
    // Encontre o asaasCustomerId com base no customerId
    const customer = await Customer.findOne({ custumerId: custumerId });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const asaasCustomerId = customer.asaasCustomerId;

    // Encontre todos os pedidos correspondentes
    let paymentReports = await PaymentReports.find({
      "payment.customer": asaasCustomerId,
    }, { _id: 0, __v: 0 }) // Projeção para excluir campos não necessários
    .skip(skip).limit(pageSize);

    // Defina a ordem de prioridade dos status
    const statusPriority = {
      RECEIVED: 1,
      CONFIRMED: 2,
      PENDING: 3,
      OVERDUE: 4,
    };

    // Ordenar os resultados com base no status
    paymentReports = paymentReports.sort((a, b) => {
      const statusA = a.payment.status;
      const statusB = b.payment.status;

      // Compare os status com base na ordem de prioridade
      return statusPriority[statusA] - statusPriority[statusB];
    });

    res.json(paymentReports);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});


router.get("/order/:customerId/:orderId", async (req, res) => {
  const customerId = req.params.customerId;
  const orderId = req.params.orderId;

  try {
    // Encontre o asaasCustomerId com base no custumerId
    const customer = await Customer.findOne({ custumerId: customerId });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const asaasCustomerId = customer.asaasCustomerId;

    // Encontre a ordem específica
    const order = await PaymentReports.findOne({
      "payment.id": orderId,
      "payment.customer": asaasCustomerId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar a ordem:", error);
    res.status(500).json({ error: "Erro ao buscar a ordem" });
  }
});

// ver os status de todos os pedidos de pix boleto e cartao de credito do sistema do asaas
router.get("/allOrders", async (req, res) => {
  try {
    // Encontre todos os pedidos
    const allOrders = await PaymentReports.find();

    res.json(allOrders);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// ver todos os usuarios cadastrados no meu sistema

router.get("/customers/data", async (req, res) => {
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



router.get("/allOrders/:custumerId", async (req, res) => {
  const custumerId = req.params.custumerId;
  const page = req.query.page ? parseInt(req.query.page) : 1; // Obtendo o número da página

  try {
    const pageSize = 10; // Tamanho da página
    const skip = (page - 1) * pageSize; // Quantidade de documentos a pular
    // Find the customer's data in other schemas
    const boletoData = await Boleto.find({ custumerId: custumerId }).skip(skip).limit(pageSize);
    const creditCardData = await CreditCard.find({ custumerId: custumerId }).skip(skip).limit(pageSize);
    const pixData = await PixQRcode.find({ custumerId: custumerId }).skip(skip).limit(pageSize);
 

    // Check if any data is found for the customer
    if (!boletoData.length && !creditCardData.length && !pixData.length) {
      return res.status(404).json({ error: "Dados do cliente não encontrados" });
    }

    // Update statuses for Boleto orders
    for (const boletoOrder of boletoData) {
      const orderId = boletoOrder.orderId;
      const paymentReport = await PaymentReports.findOne({
        "payment.id": orderId,
      });
      if (paymentReport) {
        boletoOrder.status = paymentReport.payment.status;
        await boletoOrder.save();
      }
    }

    // Update statuses for Credit Card orders
    for (const creditCardOrder of creditCardData) {
      const orderId = creditCardOrder.orderId; // Assuming orderId exists for CreditCard model
      const paymentReport = await PaymentReports.findOne({
        "payment.id": orderId,
      });
      if (paymentReport) {
        creditCardOrder.status = paymentReport.payment.status;
        await creditCardOrder.save();
      }
    }

    // Update statuses for Pix orders
    for (const pixOrder of pixData) {
      const orderId = pixOrder.orderId; // Assuming orderId exists for PixQRcode model
      const paymentReport = await PaymentReports.findOne({
        "payment.id": orderId,
      });
      if (paymentReport) {
        pixOrder.status = paymentReport.payment.status;
        await pixOrder.save();
      }
    }

    const responseData = {
      boleto: boletoData,
      creditCard: creditCardData,
      pix: pixData,
    };

    // Send the response after updating all orders
    res.json(responseData);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});


router.get("/customers/data/:customer",isAuthenticated, isAdmin,  async (req, res) => {
  try {
    const customer = req.params.customer;

    const customers = await Customer.findOne({ asaasCustomerId: customer });
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Erro ao pegar clientes:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao pegar clientes." });
  }
});


router.get("/boletos", isAuthenticated, isAdmin,  async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página atual
    const pageSize = 10; // Tamanho da página, ou seja, o número máximo de boletos por página
    const skip = (page - 1) * pageSize; // Quantidade de documentos a pular
    const searchQuery = req.query.name; // Query de pesquisa pelo campo "name"

    let query = {}; // Inicialize uma query vazia

    if (searchQuery) {
      // Se houver uma query de pesquisa pelo campo "name", configure a query para filtrar por esse campo
      query = { name: { $regex: searchQuery, $options: 'i' } }; // O uso de $regex permite busca por parte do nome, e $options: 'i' torna a busca case insensitive
    }

    // Encontre todos os boletos que correspondem à query, limitando pelo tamanho da página e pulando os documentos necessários para a paginação
    const allBoletos = await Boleto.find(query).skip(skip).limit(pageSize);

    // Atualize os status para os pedidos de boleto
    for (const boleto of allBoletos) {
      const orderId = boleto.orderId;
      const paymentReport = await PaymentReports.findOne({
        "payment.id": orderId,
      });
      if (paymentReport) {
        boleto.status = paymentReport.payment.status;
        await boleto.save();
      }
    }

    // Defina a ordem de prioridade dos status
    const statusPriority = {
      RECEIVED: 1,
      CONFIRMED: 2,
      PENDING: 3,
      OVERDUE: 4,
    };

    // Ordenar os resultados com base no status
    allBoletos.sort((a, b) => {
      const statusA = a.status;
      const statusB = b.status;

      // Compare os status com base na ordem de prioridade
      return statusPriority[statusA] - statusPriority[statusB];
    });

    res.json(allBoletos);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});



router.get("/pix", isAuthenticated, isAdmin,  async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1; // Página atual
    const pageSize = 10; // Tamanho da página, ou seja, o número máximo de boletos por página
    const skip = (page - 1) * pageSize; // Quantidade de documentos a pular
    const searchQuery = req.query.name; // Query de pesquisa pelo campo "name"

    let query = {}; // Inicialize uma query vazia

    if (searchQuery) {
      // Se houver uma query de pesquisa pelo campo "name", configure a query para filtrar por esse campo
      query = { name: { $regex: searchQuery, $options: 'i' } }; // O uso de $regex permite busca por parte do nome, e $options: 'i' torna a busca case insensitive
    }
    // Encontre todos os pedidos
    const allOrders = await PixQRcode.find(query).skip(skip).limit(pageSize);
    // Update statuses for Credit Card orders
    for (const creditCardOrder of allOrders) {
      const orderId = creditCardOrder.orderId; // Assuming orderId exists for CreditCard model
      const paymentReport = await PaymentReports.findOne({
        "payment.id": orderId,
      });
      if (paymentReport) {
        creditCardOrder.status = paymentReport.payment.status;
        await creditCardOrder.save();
      }
    }

      // Defina a ordem de prioridade dos status
      const statusPriority = {
        RECEIVED: 1,
        CONFIRMED: 2,
        PENDING: 3,
        OVERDUE: 4,
      };
  
      // Ordenar os resultados com base no status
      allOrders.sort((a, b) => {
        const statusA = a.status;
        const statusB = b.status;
  
        // Compare os status com base na ordem de prioridade
        return statusPriority[statusA] - statusPriority[statusB];
      });
    res.json(allOrders);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

router.get("/creditCard", isAuthenticated, isAdmin,  async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página atual
    const pageSize = 10; // Tamanho da página
    const skip = (page - 1) * pageSize; // Quantidade de documentos a pular
    const searchQuery = req.query.name; // Query de pesquisa pelo campo "name"

    let query = {}; // Inicialize uma query vazia

    if (searchQuery) {
      // Se houver uma query de pesquisa pelo campo "name", configure a query para filtrar por esse campo
      query = { name: { $regex: searchQuery, $options: 'i' } }; // O uso de $regex permite busca por parte do nome, e $options: 'i' torna a busca case insensitive
    }

    // Encontre todos os pedidos ordenados pelo status de forma descendente
    const allOrders = await CreditCard.find(query)
                                      .sort({ status: -1 })
                                      .skip(skip)
                                      .limit(pageSize);

    // Update statuses for Pix orders
    for (const pixOrder of allOrders) {
      const orderId = pixOrder.orderId; // Assuming orderId exists for PixQRcode model
      const paymentReport = await PaymentReports.findOne({
        "payment.id": orderId,
      });
      if (paymentReport) {
        pixOrder.status = paymentReport.payment.status;
        await pixOrder.save();
      }
    }

    res.json(allOrders);

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

router.get("/boleto/:id", isAuthenticated, isAdmin,  async (req, res) => {
  try {
    // Acesse o id do parâmetro da rota
    const id = req.params.id;

    // Encontre o pedido com o ID fornecido
    const order = await Boleto.findById(id);

    // Verifique se o pedido existe
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

router.get("/creditCard/:id", isAuthenticated, isAdmin,  async (req, res) => {
  try {
    // Acesse o id do parâmetro da rota
    const id = req.params.id;

    // Encontre o pedido com o ID fornecido
    const order = await CreditCard.findById(id);

    // Verifique se o pedido existe
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

router.get("/pix/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Acesse o id do parâmetro da rota
    const id = req.params.id;

    // Encontre o pedido com o ID fornecido
    const order = await PixQRcode.findById(id);

    // Verifique se o pedido existe
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});



module.exports = router;

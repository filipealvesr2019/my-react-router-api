const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const errorHandler = require('./errorHandler/errorHandler');

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const cloudinary = require("cloudinary")
app.use(errorHandler);

require('dotenv').config();

// Configurações e middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(cookieParser());


// Rotas
const routes = require('./routes/AuthRoutes');
const orders = require('./routes/order');


const products = require('./routes/products')
const auth = require('./routes/Customer')
const order = require('./routes/order')
const category = require('./routes/category');


app.post('/api/upload', upload.single('file'), (req, res) => {
  // req.file contém as informações do arquivo enviado
  // Faça o que for necessário, como salvar o caminho da imagem no banco de dados
  const filePath = req.file.path;
  res.status(200).send('Upload bem-sucedido!');
});
app.use('/api', products)
app.use('/api', auth)
app.use('/api', order)
app.use('/api', category)

app.use('/', routes);
app.use('/', orders);
// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(bodyParser.urlencoded({extended:true}))


app.use(express.json());




// Acesso à variável de ambiente MONGODB_URI do arquivo .env
const uri = process.env.MONGODB_URI;



// Conexão com o banco de dados
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao banco de dados');
}).catch((error) => {
  console.error('Erro de conexão com o banco de dados:', error);
});

// Iniciar o servidor
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor em execução na porta http://localhost:${port}`);
});

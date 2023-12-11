const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Entre o nome do Produto'],
        trim: true,
        maxLength: [100, 'O Produto não pode exceder 100 palavras']
    },
    price: {
        type: Number,
        required: [true, 'Digite o preço'],
        maxLength: [5, 'O preço não pode exceder 5 numeros'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Digite a descrição']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    color: {
        type: String,
        required: [true, "Digite a cor do Produto"]
    },
    size: {
        type: String,
        required: [true, "Digite o tamanho do produto "]
    },
    category: {
        type: String,
        required: [true, "Digite a categoria do Produto"]
    },
    stock: {
        type: Number,
        required: [true, "Digite a quantidade do Produto em estoque"],
        maxLength: [5, "O produto em estoque não pode exceder a 5 numeros"],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            Comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);

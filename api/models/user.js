const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Digite o seu nome."],
        maxLength: [30, "Seu nome não pode exceder 30 caracteres"],
    },
    email: {
        type: String,
        required: [true, "Digite o seu email."],
        unique: true,
        validate: [validator.isEmail, "Digite um endereço de email válido"],
    },
    password: {
        type: String,
        required: [true, "Digite uma senha"],
        minLength: [10, "Digite uma senha de no mínimo 10 caracteres"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        required: [true, "Avatar is required"],
    },
    url: {
        type: String,
        required: [true, "URL is required"],
    },
    role: {
        type: String,
        default: "UserRole",
    },
    create: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

module.exports = mongoose.model("UserRole", userSchema);

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const UserRole = new mongoose.Schema({
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
        publica_id:{
            type: String, // or any other type for your array elements
            required: true,
        },
    
        url: {
            type: String,
            required: [true, "URL is required"],
        },
      }
      ,
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

// comparar senhas de usuario
UserRole.methods.comparePassword = async function (gotPassword){
    return await bcrypt.compare(gotPassword, this.password)
}


// criptografando a senha antes de salva o email e senha do usuario
UserRole.pre('save', async function(next){
    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// JWT token
UserRole.methods.getJwtToken = function () {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_DURATION
    });
}


// gerar token para rezetar a senha
UserRole.methods.getResetPasswordToken =  function () {
    // gerar token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash senha e envia devolta token de recuperção de senha
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // tempo de duração do token 
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken;
}



module.exports = mongoose.model("UserRole", UserRole);

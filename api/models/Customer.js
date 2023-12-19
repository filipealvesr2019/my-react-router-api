const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const Customer = new mongoose.Schema({
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
    orders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
      ],
    create: {
        type: Date,
        default: Date.now,
    },
    loginAttempts: {
        type: Number,
        default: 0,
      },
    
      lockUntil: {
        type: Number,
        default: 0,
      },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// comparar senhas de usuario
Customer.methods.comparePassword = async function (gotPassword){
    return await bcrypt.compare(gotPassword, this.password)
}


// criptografando a senha antes de salva o email e senha do usuario
Customer.pre('save', async function(next){
    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// JWT token
Customer.methods.getJwtToken = function () {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_DURATION
    });
}





module.exports = mongoose.model("Customer", Customer);

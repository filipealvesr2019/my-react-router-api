const User = require("../models/user")


// cadastro de usuarios => /api/v1/register
exports.registerUser = async (req, res, next) => {
    const { name, email, password} = req.body;
    
    if(password.length < 10){
        return res.status(400).json({
            success:false,
            error:"A senha deve ter pelo menos 10 caracteres."
        })
    }
    const user = await User.create({
        name, email, password, avatar:{
            publica_id: "/avatars/michael-dam-mEZ3PoFGs_k-unsplash_2_pmcmih",
            url:"https://res.cloudinary.com/dcodt2el6/image/upload/v1700826137/avatars/michael-dam-mEZ3PoFGs_k-unsplash_2_pmcmih.jpg"
        }
    })

    res.status(201).json({
         success:true,
         user
         
    })
}

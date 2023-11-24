const User = require("../models/user")


// cadastro de usuarios => /api/v1/register
exports.registerUser = async (res, req, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password, avatar:{
            publica_id: "",
            url:"michael-dam-mEZ3PoFGs_k-unsplash_2_pmcmih"
        }
    })

    res.status(201).json({
         success:true,
         
    })
}

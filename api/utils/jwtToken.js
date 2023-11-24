// criar token e salvar nos cookies
const sendToken = (user, statusCode, res) =>{
    //criar jwt token
    const token = user.getJwtToken();

    // opçose para os cookies

    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_DURATION * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }
    res.status(statusCode).cookie("token", token , options).json({
        success:true,
        token,
        user
    })
}

module.exports = sendToken;
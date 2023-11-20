exports.getProducts = (req, res, next) => {
    res.status(200).json({
        success:true,
        message:"rota que mostra todas os produtos no banco de dados"
    })
}
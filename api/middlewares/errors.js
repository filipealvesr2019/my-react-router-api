const errorHandler = require('../errorhandler/errorHandler');



module.exports = (err, req, res,  next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Erro Interno do servidor";


    res.status(err.statusCode).json({
        success:false,
        error:err.stack 
    })
}


const { Error } = require("mongoose");

// error Handler Class
class errorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode

        
        Error.captureStackTrace(this, this.constructor)
    }
}


module.exports = errorHandler;
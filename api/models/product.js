const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'Enter the name of the Product'],
        trim:true,
        maxLength:[100, 'Product name cannot exceed 100 words']
    },
    price:{
        type: String,
        required:[true, 'Provide the Product Price '],
        trim:true,
        maxLength:[100, 'The price of the product cannot exceed 100 words']
    }
})


module.exports = mongoose.model('Product', productSchema)
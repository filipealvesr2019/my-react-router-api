const mongoose = require("mongoose");
const validator = require("validator");



const Customer = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
 
   
 
});

module.exports = mongoose.model("Customer", Customer);

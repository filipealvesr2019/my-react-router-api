// models/Subcategory.js
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: String,


});


module.exports = mongoose.model('Subcategory', subcategorySchema);

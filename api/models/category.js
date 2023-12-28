// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:{ 
    type:String,
    required:true,
    unique: true,

  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
  }],
});

module.exports = mongoose.model('Category', categorySchema);

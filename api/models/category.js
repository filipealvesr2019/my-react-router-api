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
  images: [{
    type: String, // Assuming you store photo URLs
  }],
});

module.exports = mongoose.model('Category', categorySchema);

// models/Category.js
const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
  imageUrl: String,
});
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
    type:  [imageSchema], // Assuming you store photo URLs
  }],
});

module.exports = mongoose.model('Category', categorySchema);

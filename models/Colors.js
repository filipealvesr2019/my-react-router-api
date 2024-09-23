// models/Category.js
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name:{ 
    type:String,
    required:true,
    unique: true,
  },
  color: { 
    type:String,
    required:true,
    unique: true,
  },

});

module.exports = mongoose.model('Color', colorSchema);

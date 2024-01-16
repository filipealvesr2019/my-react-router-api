// models/Slider.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  images: [imageSchema],
});

module.exports = mongoose.model('Slider', sliderSchema);

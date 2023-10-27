const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['employee'],
    required: true,
  },
});

const UserEmployee = mongoose.model('UserEmployeee', userSchema);

module.exports = UserEmployee;

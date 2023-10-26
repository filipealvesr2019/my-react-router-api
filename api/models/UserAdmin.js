const mongoose = require('mongoose');

const userAdminSchema = new mongoose.Schema({
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
    enum: ['admin'],
    required: true,
  },
});

const UserAdmin = mongoose.model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;

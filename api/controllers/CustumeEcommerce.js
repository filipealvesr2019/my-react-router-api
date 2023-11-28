// userController.js
const User = require('../models/CustumeModel');

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
const newUser = new User({ username, email, password });  // Inclua o campo 'password'
const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getAllUsers };

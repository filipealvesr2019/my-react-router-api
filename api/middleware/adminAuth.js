// adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserRole');

const adminAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Acesso não autorizado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (user.role === 'administrador') {
      // If the user is an admin, allow access
      next();
    } else {
      return res.status(403).json({ success: false, error: 'Acesso não permitido.' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' });
  }
};

module.exports = adminAuth;

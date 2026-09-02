const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'memomate_sih2026_super_secret_key_98765');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is expired or invalid' });
  }
};

module.exports = authMiddleware;

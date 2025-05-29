const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  // console.log raw header for debug
  // console.log('Authorization header:', authHeader);

  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token in auth middleware:', decoded);  // <-- debug log
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token invalid:', err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;

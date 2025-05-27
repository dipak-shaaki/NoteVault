const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.header('Authorization');
    // console.log('Authorization header:', authHeader); // ← ADD THIS

    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
        console.log('No token found in header');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Token invalid:', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;
